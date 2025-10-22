import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:vibe_guard/models/app_settings.dart';
import 'package:vibe_guard/models/quiet_period.dart';

final settingsControllerProvider =
    StateNotifierProvider<SettingsController, AsyncValue<AppSettings>>(
  (StateNotifierProviderRef<SettingsController, AsyncValue<AppSettings>> ref) {
    return SettingsController();
  },
);

class SettingsController extends StateNotifier<AsyncValue<AppSettings>> {
  SettingsController() : super(const AsyncValue.loading()) {
    unawaited(_load());
  }
  static const String _storageKey = 'vibe_guard_settings';

  Future<void> _load() async {
    try {
      final SharedPreferences prefs = await SharedPreferences.getInstance();
      final String? cached = prefs.getString(_storageKey);
      if (cached == null) {
        state = AsyncValue.data(AppSettings.defaults());
      } else {
        state = AsyncValue.data(AppSettings.fromJson(cached));
      }
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
    }
  }

  Future<void> update(AppSettings Function(AppSettings) updater) async {
    final AppSettings? current = state.value;
    if (current == null) return;
    final AppSettings updated = updater(current);
    state = AsyncValue.data(updated);
    await _persist(updated);
  }

  Future<void> _persist(AppSettings settings) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString(_storageKey, settings.toJson());
  }

  Future<void> updateQuietPeriod(int index, QuietPeriod period) async {
    await update((AppSettings settings) {
      final List<QuietPeriod> periods = List<QuietPeriod>.from(settings.quietPeriods);
      if (index < periods.length) {
        periods[index] = period;
      }
      return settings.copyWith(quietPeriods: periods);
    });
  }

  Future<void> addQuietPeriod(QuietPeriod period) async {
    await update((AppSettings settings) {
      final List<QuietPeriod> periods = <QuietPeriod>[...settings.quietPeriods, period];
      return settings.copyWith(quietPeriods: periods);
    });
  }

  Future<void> removeQuietPeriod(int index) async {
    await update((AppSettings settings) {
      final List<QuietPeriod> periods = List<QuietPeriod>.from(settings.quietPeriods);
      if (index < periods.length) {
        periods.removeAt(index);
      }
      return settings.copyWith(quietPeriods: periods);
    });
  }
}
