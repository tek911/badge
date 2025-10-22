import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:vibe_guard/controllers/settings_controller.dart';
import 'package:vibe_guard/models/app_settings.dart';
import 'package:vibe_guard/models/quiet_period.dart';
import 'package:vibe_guard/screens/location_picker_screen.dart';
import 'package:vibe_guard/widgets/quiet_period_tile.dart';
import 'package:vibe_guard/widgets/settings_section.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  late final TextEditingController _uuidController;
  late final TextEditingController _addressController;
  late final TextEditingController _radiusController;
  late final TextEditingController _timerController;

  @override
  void initState() {
    super.initState();
    _uuidController = TextEditingController();
    _addressController = TextEditingController();
    _radiusController = TextEditingController(text: '100');
    _timerController = TextEditingController();
  }

  @override
  void dispose() {
    _uuidController.dispose();
    _addressController.dispose();
    _radiusController.dispose();
    _timerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final AsyncValue<AppSettings> settingsValue =
        ref.watch(settingsControllerProvider);

    return settingsValue.when(
      data: (AppSettings settings) {
        if (_uuidController.text != settings.bleUuid) {
          _uuidController.text = settings.bleUuid;
        }
        final String addressValue = settings.address ?? '';
        if (_addressController.text != addressValue) {
          _addressController.text = addressValue;
        }
        final String radiusValue = settings.radiusMeters.toStringAsFixed(0);
        if (_radiusController.text != radiusValue) {
          _radiusController.text = radiusValue;
        }
        final String timerValue =
            settings.timerDurationMinutes?.toString() ?? '';
        if (_timerController.text != timerValue) {
          _timerController.text = timerValue;
        }

        return Scaffold(
          appBar: AppBar(
            title: const Text('Vibe Guard'),
            centerTitle: true,
          ),
          floatingActionButton: settings.scheduleMonitoringEnabled
              ? FloatingActionButton.extended(
                  onPressed: () async {
                    await _addQuietPeriod();
                  },
                  icon: const Icon(Icons.add_alarm),
                  label: const Text('Add quiet period'),
                )
              : null,
          body: RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(settingsControllerProvider);
            },
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: <Widget>[
                SettingsSection(
                  title: 'Bluetooth trigger',
                  subtitle:
                      'Switch to vibrate when the target beacon is nearby.',
                  trailing: Switch(
                    value: settings.bleMonitoringEnabled,
                    onChanged: (bool value) {
                      _updateSettings(
                        (AppSettings current) =>
                            current.copyWith(bleMonitoringEnabled: value),
                      );
                    },
                  ),
                  child: Column(
                    children: <Widget>[
                      TextField(
                        controller: _uuidController,
                        decoration: const InputDecoration(
                          labelText: 'BLE Service UUID',
                          hintText: 'e.g. 12345678-1234-1234-1234-1234567890ab',
                          prefixIcon: Icon(Icons.bluetooth_searching),
                        ),
                        onChanged: (String value) {
                          _updateSettings(
                            (AppSettings current) =>
                                current.copyWith(bleUuid: value.trim()),
                          );
                        },
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Enter the BLE service UUID advertised by the device that should trigger vibration mode.',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                SettingsSection(
                  title: 'Location trigger',
                  subtitle:
                      'Enable vibrate mode automatically near your saved place.',
                  trailing: Switch(
                    value: settings.locationMonitoringEnabled,
                    onChanged: (bool value) {
                      _updateSettings(
                        (AppSettings current) =>
                            current.copyWith(locationMonitoringEnabled: value),
                      );
                    },
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      TextField(
                        controller: _addressController,
                        decoration: InputDecoration(
                          labelText: 'Location address',
                          hintText: 'Search or paste an address',
                          prefixIcon: const Icon(Icons.location_on_outlined),
                          suffixIcon: IconButton(
                            icon: const Icon(Icons.map),
                            onPressed: () async {
                              final LatLngLocation? updated = await Navigator.of(context)
                                  .push<LatLngLocation>(
                                MaterialPageRoute<LatLngLocation>(
                                  builder: (BuildContext context) =>
                                      LocationPickerScreen(
                                    initialLatitude: settings.latitude,
                                    initialLongitude: settings.longitude,
                                    initialAddress: settings.address,
                                  ),
                                ),
                              );
                              if (updated != null) {
                                _updateSettings(
                                  (AppSettings current) => current.copyWith(
                                    latitude: updated.latitude,
                                    longitude: updated.longitude,
                                    address: updated.address,
                                  ),
                                );
                              }
                            },
                          ),
                        ),
                        onChanged: (String value) {
                          _updateSettings(
                            (AppSettings current) =>
                                current.copyWith(address: value.trim()),
                          );
                        },
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _radiusController,
                        keyboardType: TextInputType.number,
                        decoration: const InputDecoration(
                          labelText: 'Radius (meters)',
                          prefixIcon: Icon(Icons.radar),
                        ),
                        onChanged: (String value) {
                          final double radius =
                              double.tryParse(value) ?? settings.radiusMeters;
                          _updateSettings(
                            (AppSettings current) =>
                                current.copyWith(radiusMeters: radius),
                          );
                        },
                      ),
                      const SizedBox(height: 12),
                      Text(
                        settings.latitude != null
                            ? 'Saved coordinates: ${settings.latitude!.toStringAsFixed(5)}, '
                                '${settings.longitude!.toStringAsFixed(5)}'
                            : 'No location selected yet.',
                        style: Theme.of(context)
                            .textTheme
                            .bodySmall
                            ?.copyWith(color: Theme.of(context).colorScheme.outline),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                SettingsSection(
                  title: 'Quiet schedule',
                  subtitle:
                      'Select recurring times when vibration mode should activate.',
                  trailing: Switch(
                    value: settings.scheduleMonitoringEnabled,
                    onChanged: (bool value) {
                      _updateSettings(
                        (AppSettings current) =>
                            current.copyWith(scheduleMonitoringEnabled: value),
                      );
                    },
                  ),
                  child: Column(
                    children: <Widget>[
                      if (settings.quietPeriods.isEmpty)
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: CircleAvatar(
                            backgroundColor:
                                Theme.of(context).colorScheme.secondaryContainer,
                            child: const Icon(Icons.alarm),
                          ),
                          title: const Text('No quiet periods yet'),
                          subtitle: const Text(
                            'Add time ranges to automatically switch to vibrate.',
                          ),
                        )
                      else
                        ...settings.quietPeriods
                            .asMap()
                            .entries
                            .map(
                              (MapEntry<int, QuietPeriod> entry) => QuietPeriodTile(
                                period: entry.value,
                                onEdit: () => _editQuietPeriod(entry.key, entry.value),
                                onDelete: () => ref
                                    .read(settingsControllerProvider.notifier)
                                    .removeQuietPeriod(entry.key),
                              ),
                            ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                SettingsSection(
                  title: 'Timer trigger',
                  subtitle:
                      'Start a countdown that toggles vibration when it finishes.',
                  trailing: Switch(
                    value: settings.timerMonitoringEnabled,
                    onChanged: (bool value) {
                      _updateSettings(
                        (AppSettings current) =>
                            current.copyWith(timerMonitoringEnabled: value),
                      );
                    },
                  ),
                  child: TextField(
                    controller: _timerController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Minutes',
                      prefixIcon: Icon(Icons.timer_outlined),
                    ),
                    onChanged: (String value) {
                      final int? minutes = int.tryParse(value);
                      _updateSettings(
                        (AppSettings current) =>
                            current.copyWith(timerDurationMinutes: minutes),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      },
      loading: () => const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      ),
      error: (Object error, StackTrace stackTrace) {
        return Scaffold(
          body: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                const Icon(Icons.error_outline, size: 48),
                const SizedBox(height: 16),
                Text('Failed to load settings\n$error'),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () => ref.refresh(settingsControllerProvider),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _addQuietPeriod() async {
    final QuietPeriod? period = await showDialog<QuietPeriod>(
      context: context,
      builder: (BuildContext context) => QuietPeriodDialog(period: null),
    );
    if (period != null) {
      await ref.read(settingsControllerProvider.notifier).addQuietPeriod(period);
    }
  }

  Future<void> _editQuietPeriod(int index, QuietPeriod period) async {
    final QuietPeriod? updated = await showDialog<QuietPeriod>(
      context: context,
      builder: (BuildContext context) => QuietPeriodDialog(period: period),
    );
    if (updated != null) {
      await ref
          .read(settingsControllerProvider.notifier)
          .updateQuietPeriod(index, updated);
    }
  }

  void _updateSettings(
    AppSettings Function(AppSettings current) updater,
  ) {
    ref.read(settingsControllerProvider.notifier).update(updater);
  }
}
