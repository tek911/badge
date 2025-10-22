import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:vibe_guard/controllers/settings_controller.dart';
import 'package:vibe_guard/models/app_settings.dart';
import 'package:vibe_guard/screens/home_screen.dart';
import 'package:vibe_guard/services/background_vibration_service.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ProviderScope(child: VibeGuardApp()));
}

class VibeGuardApp extends ConsumerWidget {
  const VibeGuardApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.listen<AsyncValue<AppSettings>>(settingsControllerProvider, (AsyncValue<AppSettings>? previous, AsyncValue<AppSettings> next) {
      next.whenData((AppSettings settings) {
        BackgroundVibrationService.instance.startWithSettings(settings);
      });
    });

    return MaterialApp(
      title: 'Vibe Guard',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
