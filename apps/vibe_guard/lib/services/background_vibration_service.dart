import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_background_service/flutter_background_service.dart';
import 'package:flutter_background_service_android/flutter_background_service_android.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:sound_mode/permission_handler.dart' as sound_permission;
import 'package:sound_mode/sound_mode.dart';

import 'package:vibe_guard/models/app_settings.dart';
import 'package:vibe_guard/models/quiet_period.dart';

class BackgroundVibrationService {
  BackgroundVibrationService._();

  static final BackgroundVibrationService instance = BackgroundVibrationService._();
  static const String _settingsChannel = 'updateSettings';

  final FlutterBackgroundService _service = FlutterBackgroundService();
  Future<void> ensureInitialized() async {
    await _requestCorePermissions();
    await _service.configure(
      androidConfiguration: AndroidConfiguration(
        onStart: onStart,
        autoStart: true,
        isForegroundMode: true,
        notificationChannelId: 'vibe_guard_channel',
        initialNotificationTitle: 'Vibe Guard running',
        initialNotificationContent: 'Monitoring for triggers',
      ),
      iosConfiguration: IosConfiguration(
        autoStart: true,
        onForeground: onStart,
        onBackground: onIosBackground,
      ),
    );
  }

  Future<void> startWithSettings(AppSettings settings) async {
    await ensureInitialized();
    if (!await _service.isRunning()) {
      await _service.startService();
    }
    await _service.invoke(_settingsChannel, settings.toMap());
  }

  Future<void> stop() async {
    await _service.stopService();
  }

  Future<void> _requestCorePermissions() async {
    await Permission.locationAlways.request();
    await Permission.bluetoothScan.request();
    await Permission.bluetoothConnect.request();
    await Permission.notification.request();
    if (Platform.isAndroid) {
      await sound_permission.SoundModePermissionHandler().openDoNotDisturbSetting();
    }
  }

  @pragma('vm:entry-point')
  static Future<bool> onIosBackground(ServiceInstance service) async {
    WidgetsFlutterBinding.ensureInitialized();
    return true;
  }

  @pragma('vm:entry-point')
  static void onStart(ServiceInstance service) {
    WidgetsFlutterBinding.ensureInitialized();
    _BackgroundWorker? worker;
    late final StreamSubscription<Map<String, dynamic>?> subscription;
    subscription = service
        .on(_settingsChannel)
        .listen((Map<String, dynamic>? payload) {
      if (payload == null) return;
      worker?.dispose();
      final AppSettings settings = AppSettings.fromMap(payload);
      worker = _BackgroundWorker(service: service, settings: settings)..run();
    });

    service.on('stopService').listen((_) async {
      await subscription.cancel();
      worker?.dispose();
      await service.stopSelf();
    });
  }
}

class _BackgroundWorker {
  _BackgroundWorker({required this.service, required this.settings});

  final ServiceInstance service;
  final AppSettings settings;

  StreamSubscription<ScanResult>? _scanSubscription;
  Timer? _locationTimer;
  Timer? _scheduleTimer;
  Timer? _vibrationTimer;

  void run() {
    if (settings.bleMonitoringEnabled && settings.bleUuid.isNotEmpty) {
      _startBleScan();
    }
    if (settings.locationMonitoringEnabled) {
      _startLocationTimer();
    }
    if (settings.scheduleMonitoringEnabled) {
      _startScheduleTimer();
    }
    if (settings.timerMonitoringEnabled && settings.timerDurationMinutes != null) {
      _startCountdownTimer(settings.timerDurationMinutes!);
    }
  }

  Future<void> _startBleScan() async {
    if (!await Permission.bluetoothScan.isGranted) {
      await Permission.bluetoothScan.request();
    }
    await FlutterBluePlus.instance.startScan(timeout: const Duration(seconds: 30));
    _scanSubscription = FlutterBluePlus.instance.scanResults.listen((List<ScanResult> results) {
      final bool found = results.any((ScanResult result) {
        return result.advertisementData.serviceUuids.contains(settings.bleUuid);
      });
      if (found) {
        _setDeviceToVibrate();
      }
    });
  }

  Future<void> _startLocationTimer() async {
    _locationTimer?.cancel();
    _locationTimer = Timer.periodic(const Duration(minutes: 1), (_) async {
      final Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.best,
      );
      if (settings.latitude != null && settings.longitude != null) {
        final double distance = Geolocator.distanceBetween(
          settings.latitude!,
          settings.longitude!,
          position.latitude,
          position.longitude,
        );
        if (distance <= settings.radiusMeters) {
          _setDeviceToVibrate();
        }
      }
    });
  }

  void _startScheduleTimer() {
    _scheduleTimer?.cancel();
    _scheduleTimer = Timer.periodic(const Duration(minutes: 1), (_) {
      final DateTime now = DateTime.now();
      for (final QuietPeriod period in settings.quietPeriods) {
        final bool matchesDay = period.daysOfWeek.isEmpty ||
            period.daysOfWeek.contains(now.weekday % DateTime.daysPerWeek);
        if (!matchesDay) continue;
        final int minutes = now.hour * 60 + now.minute;
        if (minutes >= period.startMinutes && minutes <= period.endMinutes) {
          _setDeviceToVibrate();
          break;
        }
      }
    });
  }

  void _startCountdownTimer(int minutes) {
    _vibrationTimer?.cancel();
    _vibrationTimer = Timer(Duration(minutes: minutes), _setDeviceToVibrate);
  }

  Future<void> _setDeviceToVibrate() async {
    if (Platform.isAndroid) {
      try {
        await SoundMode.setSoundMode(RingerModeStatus.vibrate);
      } catch (_) {}
    }
    if (service is AndroidServiceInstance) {
      (service as AndroidServiceInstance).setForegroundNotificationInfo(
        title: 'Vibe Guard active',
        content: 'Device switched to vibrate mode',
      );
    }
  }

  void dispose() {
    _scanSubscription?.cancel();
    FlutterBluePlus.instance.stopScan();
    _locationTimer?.cancel();
    _scheduleTimer?.cancel();
    _vibrationTimer?.cancel();
  }
}
