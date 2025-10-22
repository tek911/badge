# Vibe Guard

Vibe Guard is a Flutter application for Android and iOS that automatically switches your phone to vibrate mode based on proximity to a Bluetooth Low Energy (BLE) beacon, a saved GPS location, or scheduled quiet hours. The app runs as a configurable background service so you can set it once and keep your environment quiet when it matters most.

## Features

- 📡 **BLE trigger** – monitor for a target BLE service UUID and toggle vibrate mode when the beacon is nearby.
- 📍 **Location trigger** – automatically switch to vibrate within a configurable geofence radius around an address or your live GPS position.
- ⏰ **Quiet schedules** – create recurring quiet periods with day-of-week filtering and friendly editing tools.
- ⌛ **Countdown timer** – trigger vibrate mode after a user-defined timer elapses.
- 🗺️ **Modern map picker** – select or update the saved location on an interactive Google Map with live geocoding.
- 🔄 **Persistent background service** – relies on `flutter_background_service` so monitoring continues even when the UI is closed.

## Getting started

> **Prerequisites**
>
> - Flutter 3.19 or newer
> - Android Studio / Xcode for platform builds
> - Google Maps API keys configured for Android and iOS (see below)
> - BLE-compatible hardware that advertises the configured service UUID

1. If this is a fresh clone, let Flutter scaffold the missing platform folders:
   ```bash
   flutter create .
   ```
2. Install dependencies:
   ```bash
   flutter pub get
   ```
3. Configure Google Maps:
   - Android: add your key to `android/app/src/main/AndroidManifest.xml`.
   - iOS: add your key to `ios/Runner/AppDelegate.swift` or the `Info.plist` according to the [google_maps_flutter documentation](https://pub.dev/packages/google_maps_flutter#ios).
4. Run the app:
   ```bash
   flutter run
   ```

## Background service

The background worker is implemented with `flutter_background_service`. When settings are updated the service receives the new configuration and checks BLE scans, geofence proximity, quiet schedules, and countdown timers. On Android the `sound_mode` package is used to change the ringer mode to vibrate. iOS limits programmatic control over the ringer switch, so the app focuses on providing actionable reminders and vibrations.

To comply with platform requirements you should update notification texts, icons, and request the appropriate background permissions in the platform projects (`android/` and `ios/`).

## Project structure

```
lib/
 ├── controllers/          # Riverpod notifiers and persistence
 ├── models/               # Settings data classes
 ├── screens/              # UI screens (home, location picker)
 ├── services/             # Background service, geocoding helpers
 └── widgets/              # Reusable UI building blocks
```

## Next steps

- Add platform-specific permission prompts and fallback UX.
- Customize Android foreground notification appearance.
- Extend background logic to support multiple BLE UUIDs or Wi-Fi triggers.
- Add integration tests using `flutter_test` once native tooling is available in CI.

## License

This project is provided as-is for demonstration purposes.
