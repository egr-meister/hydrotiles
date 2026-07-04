# HydroTiles

HydroTiles is an offline, manual water tracker for Android where your daily
progress is shown as a grid of water tiles. Each tile represents part of your
daily goal (for example 250 ml). As you add water, tiles fill up and your day
becomes a small water mosaic.

The app is built with React Native and Expo, is Android-focused, portrait-only,
and works fully offline — including in airplane mode.

---

## 1. Project description

HydroTiles turns a daily water goal into a **tile board**. You set how much one
tile represents and what your daily goal is; the app divides the goal into tiles
and you fill them manually as you drink. There is no backend, no account, and no
network access. Everything is stored locally on the device.

## 2. Features

- Daily tile grid that fills as you add water.
- Tap a tile to fill it; tap the last filled tile to unfill it.
- Quick "fill one tile" and custom amount entry.
- Adjustable tile size (100 / 150 / 200 / 250 / 300 / 500 ml).
- Compact or comfortable tile layout.
- Daily water goal with validation.
- History of previous days (reverse chronological).
- Monthly calendar with empty / partial / goal-reached tile states.
- Simple streak (current and best) based on days that reached the goal.
- Weekly statistics with a tile-style bar summary.
- Gentle in-app reminder cards (never phone notifications).
- Full local storage with safe defaults and corruption handling.
- Day detail screen with per-entry edit, delete, and day reset.

## 3. Manual tracking disclaimer

**HydroTiles is a manual water tracker. It does not detect drinking
automatically and does not connect to Health Connect, Google Fit, sensors, or
wearable devices.** Every water entry is added by you, by hand. The app shows
"Water entries are added manually" in onboarding, the entry screen, and
settings.

## 4. Offline-first

HydroTiles never contacts a server. All logic runs on the device and all data
is stored locally with `@react-native-async-storage/async-storage`. There is no
sign-in, no sync, and no cloud copy of your data.

## 5. No internet / no permissions

The app does not request runtime permissions and does not need the `INTERNET`
permission. The Android manifest blocks `INTERNET` and other sensitive
permissions (see `app.json` → `android.blockedPermissions`). HydroTiles does not
request location, camera, microphone, contacts, storage, notifications,
calendar, alarms, activity recognition, or body sensors.

## 6. No sensors

HydroTiles reads no device sensors. It does not use the accelerometer, step
counter, or any physical-activity signal.

## 7. No Google Fit

There is no Google Fit integration and no Google Fit SDK.

## 8. No Health Connect

There is no Health Connect integration and no Health Connect SDK.

## 9. No wearable integration

HydroTiles does not connect to smartwatches or any wearable device.

## 10. No automatic water detection

The app never guesses or auto-logs drinks. Progress only changes when you fill a
tile or add an entry.

## 11. Non-medical disclaimer

HydroTiles is a practical, offline wellness-style utility. It is **not** a
medical, diagnostic, treatment, or sports-performance app. It makes no medical
claims and provides no medical advice. If you have specific hydration needs,
consult a qualified professional.

## 12. In-app reminders

Reminders are shown **only inside the app** as calm reminder cards on the home
screen. They are evaluated from today's tile progress and the current time while
the app is open. Examples:

- After 11:00 with nothing logged: "No tiles filled today. Add one if you drank water."
- After 16:00 and below 50%: "Your tile board still has empty spaces."
- After 19:00 and goal not reached: "Add any drinks you missed today."

You can toggle reminders overall, and individually for morning, afternoon, and
evening, on the Reminders screen.

## 13. No notification permission

**HydroTiles uses in-app reminder cards only. It does not send system
notifications.** It does not request notification permission, does not use
`expo-notifications`, and does not use background tasks, alarm managers, or
calendar integration.

## 14. Daily tile grid

The home screen shows a grid of tiles for the selected day. The number of tiles
is `ceil(dailyGoalMl / tileSizeMl)`. Example: a 2000 ml goal with 250 ml tiles
shows 8 tiles; filling 4 tiles equals 1000 ml. If the division is not exact, the
count rounds up to the next full tile while the real total in ml is always
stored safely.

## 15. Tile size settings

Choose how much one tile represents in Tile Settings: 100, 150, 200, 250
(default), 300, or 500 ml. Entries are stored as real ml values, so changing the
tile size updates future display and calculations without corrupting older
records.

## 16. Daily goal

Set your daily goal in Goal Settings (default 2000 ml). Progress is
`dailyTotalMl / dailyGoalMl`, capped visually at 100% while still showing the
real total. If the goal is missing or 0, the app falls back to 2000 ml. The goal
must be greater than 0 and should not exceed 10000 ml.

## 17. History

History lists daily summaries newest-first: date, total ml, goal-reached state,
filled tiles, total tiles, and entry count. Tap a day to open its detail screen
to edit or delete entries, or reset the day.

## 18. Calendar progress

The Calendar screen shows the current month as a 7-column grid of tile cells.
Each day is empty (outline), partial (soft cyan), or goal-reached (filled blue).
Tap any day to open its detail.

## 19. Streak (no rewards / no leaderboard)

The streak counts consecutive days where the daily total reached the goal. You
see current and best streaks. Missing a day or not reaching the goal resets the
current streak. An unmet **today** does not break a streak that ran through
yesterday, and an empty today never increases the streak. The streak is
informational only — there are no rewards, prizes, coins, competitions, or
leaderboards.

## 20. Statistics

The Statistics screen shows today's total, the 7-day total, the daily average,
the best day, goal days in the last 7 days, total tiles filled this week, and
the average filled tiles per day, plus a simple tile-style weekly bar summary.
No sports-performance or medical language is used.

## 21. Airplane mode support

HydroTiles works fully in airplane mode. It never needs a network connection.

## 22. Local storage

All data lives in a single AsyncStorage key. On load, stored data is merged with
safe defaults; empty storage, missing fields, and corrupted JSON all fall back
safely. Stored data: water entries, tile size, tile layout, daily goal, reminder
settings, onboarding flag, and app settings. Data survives app restarts.

## 23. App icon concept

A rounded-square pale-aqua/muted-teal icon showing a small 3×3 grid of water
tiles with several tiles filled and tiny white water-drop marks — a clean tile
tracker look with no medical symbols. Files: `assets/icon.png` and
`assets/adaptive-icon.png`.

## 24. Splash screen concept

A centered 3×3 water tile grid with the app name "HydroTiles" on a pale-aqua
background — a calm water-mosaic feeling with no heavy imagery. File:
`assets/splash.png`.

## 25. Visual style concept

"HydroTiles Water Mosaic Board": visual, clean, geometric, calm, fresh, and
practical. Warm white background, pale-aqua tile board, deep blue-gray text,
clear-blue filled tiles, soft-cyan empty tiles, muted-teal accents, and light
sand note cards. No neon, gradients heavy imagery, mascots, or default circular
tracker look.

## 26. Daily Water Tile Board layout uniqueness

The home screen is intentionally **not** a circular tracker, bottle meter,
timeline, glass shelf, spreadsheet log, or a mascot-centered dashboard with a
big vertical button stack. Instead the tile grid is the main object: a compact
header with a settings icon, quiet date and total labels, the tappable tile
board, small board controls (fill one tile / custom amount), a quiet streak
note, and small tile shortcuts. The calendar is a month of tiles; statistics is
a tile progress summary.

---

## 27. Scaffold with the Expo template

This repository already contains the full source. It was structured to match a
standard Expo project. To recreate the scaffold from scratch:

```bash
npx create-expo-app hydrotiles --template blank
```

Then copy `App.js`, the `src/` folder, `assets/`, and `app.json` into the new
project.

## 28. Install dependencies through Expo

Always install through `npx expo install` so versions match the Expo SDK:

```bash
npx expo install @react-native-async-storage/async-storage
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install expo-status-bar
npx expo install expo-asset expo-constants expo-font expo-modules-core
```

Then align everything:

```bash
npx expo install --fix
npx expo-doctor
npx expo install --check
```

Every imported package is listed as a direct dependency in `package.json`. Do
not rely on transitive dependencies.

## 29. Run locally

```bash
npm install
npx expo start
```

Press `a` to open on an Android emulator or scan the QR code with a development
build. HydroTiles works with empty/default AsyncStorage on first launch.

## 30. Build Android (local)

```bash
# Generate the native Android project
npx expo prebuild --platform android --no-install

# Build a release APK
cd android
./gradlew :app:assembleRelease

# Build a release AAB
./gradlew :app:bundleRelease
```

Outputs:

- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

To sign locally, copy your keystore to `android/app/` and add the
`HYDROTILES_UPLOAD_*` keys to `android/gradle.properties`, then add
`apply from: "../../android-signing.gradle"` to the end of
`android/app/build.gradle` (the CI does this automatically).

## 31. Generate a PKCS12 keystore

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore hydrotiles-release-key.p12 \
  -alias hydrotiles_key \
  -keyalg RSA -keysize 2048 -validity 10000
```

Use the **same password** for the keystore and the key. Never commit the
keystore or passwords to the repository.

## 32. Add GitHub Secrets

In your repository: Settings → Secrets and variables → Actions → New repository
secret. Add:

```text
ANDROID_KEYSTORE_BASE64     # base64 of hydrotiles-release-key.p12
ANDROID_KEYSTORE_PASSWORD
ANDROID_KEY_ALIAS           # e.g. hydrotiles_key
ANDROID_KEY_PASSWORD        # same as keystore password
```

Create the base64 value with:

```bash
base64 -i hydrotiles-release-key.p12 -o keystore.base64.txt   # macOS
base64 -w0 hydrotiles-release-key.p12 > keystore.base64.txt   # Linux
```

## 33. GitHub Actions

`.github/workflows/android-build.yml` runs on push to `main` (and manual
dispatch). It installs Node and JDK 17, runs `npm install`, aligns dependencies
with `npx expo install --fix`, runs `npx expo-doctor` and
`npx expo install --check`, installs Android SDK Platform 35 and Build Tools
35.0.0, runs `npx expo prebuild`, decodes the keystore from secrets, configures
signing, builds the signed release **APK** and **AAB**, and uploads both as
build artifacts. No emulator smoke-test is run on the free runners.

## 34. Google Play compatibility

The app targets Android API 35 (not 34), requests no runtime permissions, uses
no ads/analytics/payment/Fit/Health Connect/sensor/notification/background SDKs,
and blocks the `INTERNET` permission. This avoids the common Play warnings about
outdated target API and unsupported permissions.

## 35. Android API 35 notes

- `compileSdkVersion` 35 and `targetSdkVersion` 35 (provided by Expo SDK 53 /
  React Native 0.79 defaults).
- `minSdkVersion` 24 (compatible with React Native 0.79).
- Do not downgrade `targetSdkVersion` to 34.

## 36. 16 KB page size compatibility

Expo SDK 53 / React Native 0.79 with the modern Android Gradle Plugin and NDK
produce native libraries that support Android 15+ 16 KB memory page sizes. Avoid
adding old native libraries that ship pre-built `.so` files without 16 KB
alignment. Build the final AAB from a current toolchain (as configured in CI).

## 37. Release optimization

First verify a non-minified release build:

```gradle
minifyEnabled false
shrinkResources false
```

Then enable standard R8/Proguard shrinking:

```gradle
minifyEnabled true
shrinkResources true
proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
```

Re-test the app launch after enabling minify/shrink. Use only standard Android
R8/Proguard — no third-party obfuscation libraries.

## 38. Local launch verification checklist

CI success is **not** proof the app launches. Before release:

```bash
adb install app-release.apk
adb logcat
```

Confirm there are no errors such as: "Cannot find native module", "Module has
not been registered", "Invariant Violation", `theme.fonts.regular is undefined`,
AsyncStorage JSON parse crash, missing route params crash, invalid date/time
crash, invalid number crash, tile size crash, or excessive tile count crash.

Then test:

- First launch with empty storage
- Fill one tile / fill multiple tiles / unfill a tile
- Add custom amount / edit entry / delete entry
- Reset selected day
- Change tile size / switch compact and comfortable layout
- Change daily goal
- History / calendar / streak / statistics
- In-app reminders
- Reset all local data, relaunch, and airplane-mode launch
- Confirm no sensor, Google Fit, Health Connect, wearable, notification, or
  internet permission is requested

## 39. Privacy note

HydroTiles stores water entries, tile settings, goals, calendar progress,
streaks, reminders, and statistics only on this device. No account, no ads, no
analytics, no internet connection, no sensors, no Google Fit, no Health Connect,
and no notification permission.

---

## Project structure

```
hydrotiles/
├── App.js                      # Navigation + providers
├── index.js                    # Expo entry point
├── app.json                    # Expo config (icon, splash, blocked permissions)
├── package.json
├── babel.config.js
├── android-signing.gradle      # Applied by CI for signed release builds
├── assets/                     # Custom icon, adaptive icon, splash
├── .github/workflows/android-build.yml
└── src/
    ├── theme.js
    ├── storage/
    │   ├── defaults.js         # Defaults + safe merge/validation
    │   └── store.js            # AsyncStorage load/save/clear
    ├── utils/
    │   ├── date.js             # Date/time strings + month grid
    │   └── calc.js             # Tiles, progress, streak, stats, reminders
    ├── context/AppContext.js   # Central state, persisted on change
    ├── components/
    │   ├── TileGrid.js
    │   ├── ReminderCard.js
    │   └── ui.js
    └── screens/                # 11 screens
        ├── OnboardingScreen.js
        ├── HomeScreen.js
        ├── AddEntryScreen.js
        ├── DayDetailScreen.js
        ├── HistoryScreen.js
        ├── CalendarScreen.js
        ├── StatisticsScreen.js
        ├── TileSettingsScreen.js
        ├── ReminderSettingsScreen.js
        ├── GoalSettingsScreen.js
        └── SettingsScreen.js
```
