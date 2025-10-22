import 'dart:convert';

import 'package:flutter/foundation.dart';

import 'package:vibe_guard/models/quiet_period.dart';

class AppSettings {
  AppSettings({
    required this.bleUuid,
    required this.radiusMeters,
    required this.quietPeriods,
    this.bleMonitoringEnabled = true,
    this.locationMonitoringEnabled = false,
    this.scheduleMonitoringEnabled = false,
    this.timerMonitoringEnabled = false,
    this.latitude,
    this.longitude,
    this.address,
    this.timerDurationMinutes,
  });

  final bool bleMonitoringEnabled;
  final String bleUuid;
  final bool locationMonitoringEnabled;
  final double? latitude;
  final double? longitude;
  final String? address;
  final double radiusMeters;
  final bool scheduleMonitoringEnabled;
  final List<QuietPeriod> quietPeriods;
  final bool timerMonitoringEnabled;
  final int? timerDurationMinutes;

  AppSettings copyWith({
    bool? bleMonitoringEnabled,
    String? bleUuid,
    bool? locationMonitoringEnabled,
    double? latitude,
    double? longitude,
    String? address,
    double? radiusMeters,
    bool? scheduleMonitoringEnabled,
    List<QuietPeriod>? quietPeriods,
    bool? timerMonitoringEnabled,
    int? timerDurationMinutes,
  }) {
    return AppSettings(
      bleMonitoringEnabled: bleMonitoringEnabled ?? this.bleMonitoringEnabled,
      bleUuid: bleUuid ?? this.bleUuid,
      locationMonitoringEnabled:
          locationMonitoringEnabled ?? this.locationMonitoringEnabled,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      address: address ?? this.address,
      radiusMeters: radiusMeters ?? this.radiusMeters,
      scheduleMonitoringEnabled:
          scheduleMonitoringEnabled ?? this.scheduleMonitoringEnabled,
      quietPeriods: quietPeriods ?? this.quietPeriods,
      timerMonitoringEnabled: timerMonitoringEnabled ?? this.timerMonitoringEnabled,
      timerDurationMinutes: timerDurationMinutes ?? this.timerDurationMinutes,
    );
  }

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'bleMonitoringEnabled': bleMonitoringEnabled,
      'bleUuid': bleUuid,
      'locationMonitoringEnabled': locationMonitoringEnabled,
      'latitude': latitude,
      'longitude': longitude,
      'address': address,
      'radiusMeters': radiusMeters,
      'scheduleMonitoringEnabled': scheduleMonitoringEnabled,
      'quietPeriods': quietPeriods.map((QuietPeriod p) => p.toMap()).toList(),
      'timerMonitoringEnabled': timerMonitoringEnabled,
      'timerDurationMinutes': timerDurationMinutes,
    };
  }

  static AppSettings fromMap(Map<String, dynamic> map) {
    return AppSettings(
      bleMonitoringEnabled: map['bleMonitoringEnabled'] as bool? ?? true,
      bleUuid: map['bleUuid'] as String? ?? '',
      locationMonitoringEnabled:
          map['locationMonitoringEnabled'] as bool? ?? false,
      latitude: (map['latitude'] as num?)?.toDouble(),
      longitude: (map['longitude'] as num?)?.toDouble(),
      address: map['address'] as String?,
      radiusMeters: (map['radiusMeters'] as num?)?.toDouble() ?? 100,
      scheduleMonitoringEnabled:
          map['scheduleMonitoringEnabled'] as bool? ?? false,
      quietPeriods: <QuietPeriod>[
        for (final Map<String, dynamic> periodMap in (map['quietPeriods']
                as List<dynamic>? ??
            <dynamic>[])
            .whereType<Map<String, dynamic>>())
          QuietPeriod.fromMap(periodMap),
      ],
      timerMonitoringEnabled: map['timerMonitoringEnabled'] as bool? ?? false,
      timerDurationMinutes: map['timerDurationMinutes'] as int?,
    );
  }

  String toJson() => jsonEncode(toMap());

  static AppSettings fromJson(String source) =>
      AppSettings.fromMap(jsonDecode(source) as Map<String, dynamic>);

  @override
  String toString() {
    return 'AppSettings(bleMonitoringEnabled: ' '"
        '$bleMonitoringEnabled, bleUuid: $bleUuid, locationMonitoringEnabled: '
        '$locationMonitoringEnabled, latitude: $latitude, longitude: '
        '$longitude, radiusMeters: $radiusMeters, scheduleMonitoringEnabled: '
        '$scheduleMonitoringEnabled, quietPeriods: $quietPeriods, '
        'timerMonitoringEnabled: $timerMonitoringEnabled, timerDurationMinutes: '
        '$timerDurationMinutes)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is AppSettings &&
        other.bleMonitoringEnabled == bleMonitoringEnabled &&
        other.bleUuid == bleUuid &&
        other.locationMonitoringEnabled == locationMonitoringEnabled &&
        other.latitude == latitude &&
        other.longitude == longitude &&
        other.address == address &&
        other.radiusMeters == radiusMeters &&
        listEquals(other.quietPeriods, quietPeriods) &&
        other.timerMonitoringEnabled == timerMonitoringEnabled &&
        other.timerDurationMinutes == timerDurationMinutes;
  }

  @override
  int get hashCode {
    return Object.hash(
      bleMonitoringEnabled,
      bleUuid,
      locationMonitoringEnabled,
      latitude,
      longitude,
      address,
      radiusMeters,
      Object.hashAll(quietPeriods),
      timerMonitoringEnabled,
      timerDurationMinutes,
    );
  }

  static AppSettings defaults() {
    return AppSettings(
      bleUuid: '',
      radiusMeters: 100,
      quietPeriods: <QuietPeriod>[],
    );
  }
}
