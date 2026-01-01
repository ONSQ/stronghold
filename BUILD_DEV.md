# Building STRONGHOLD Development APK

Since the app uses React Native Firebase (native modules), it requires a **development build** instead of Expo Go.

## Prerequisites

1. **Android Studio** installed with Android SDK
2. **Java JDK** (version 17 recommended)
3. **Environment variables** set:
   - `ANDROID_HOME` pointing to Android SDK
   - `JAVA_HOME` pointing to JDK

## Build Steps

### Option 1: Quick Build (Recommended)

```bash
# 1. Install dependencies (if not already done)
npm install

# 2. Generate native Android/iOS folders
npx expo prebuild

# 3. Build and install on connected device
npm run android:dev
```

This will:
- Generate the native Android project
- Build a debug APK
- Install it on your connected Galaxy S24 Ultra
- Start the Metro bundler

### Option 2: Manual Build

```bash
# 1. Prebuild to generate native folders
npx expo prebuild --platform android

# 2. Navigate to android folder
cd android

# 3. Build debug APK
./gradlew assembleDebug

# 4. Install on device
adb install app/build/outputs/apk/debug/app-debug.apk
```

## First Time Setup

### 1. Install Android SDK

If you don't have Android Studio:
```bash
# Download Android Command Line Tools
# https://developer.android.com/studio#command-tools

# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 2. Connect Your Phone

```bash
# Enable Developer Options on Galaxy S24 Ultra:
# Settings → About Phone → Tap "Build Number" 7 times

# Enable USB Debugging:
# Settings → Developer Options → USB Debugging

# Verify connection
adb devices
# Should show: "xxxxxx  device"
```

### 3. Accept USB Debugging

When you connect your phone:
- Allow USB debugging prompt on phone
- Check "Always allow from this computer"

## Troubleshooting

### "SDK location not found"

Create `android/local.properties`:
```
sdk.dir=/path/to/Android/Sdk
```

On Windows:
```
sdk.dir=C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk
```

### "Java version mismatch"

```bash
# Install Java 17 (required for React Native 0.81)
# Download from: https://adoptium.net/

# Verify
java -version
# Should show: openjdk version "17.x.x"
```

### "Command failed: gradlew"

```bash
# Make gradlew executable (Mac/Linux)
chmod +x android/gradlew

# On Windows, use:
cd android
gradlew.bat assembleDebug
```

### Build Fails

```bash
# Clean build
cd android
./gradlew clean

# Try again
./gradlew assembleDebug
```

### Metro Bundler Issues

```bash
# Clear cache
npx expo start -c

# Or
npx react-native start --reset-cache
```

## What You'll Get

After successful build, you'll have:
- ✅ Full Firestore integration (data persistence)
- ✅ Native Firebase support
- ✅ Bluetooth ready for Echelon Row
- ✅ Real device performance
- ✅ Push notifications support
- ✅ All native features working

## Running After Build

Once installed on your phone:

```bash
# Start Metro bundler
npm start

# Or run directly
npm run android:dev
```

The app will automatically reload when you make code changes!

## Next Steps After Build

1. **Test Check-In Flow** - Complete a check-in, verify it saves to Firestore
2. **Test Workout Generation** - Confirm AI creates workout and saves it
3. **Check Dashboard** - Verify streak and stats load from Firestore
4. **Monitor Firestore** - Open Firebase Console to see data being saved

## Useful Commands

```bash
# View logs
npx react-native log-android

# Or
adb logcat | grep ReactNative

# Uninstall app
adb uninstall com.onsq.stronghold

# Reinstall
npm run android:dev
```

## Firebase Console

Monitor your data in real-time:
1. Go to: https://console.firebase.google.com
2. Select: stronghold-410fc
3. Navigate to: Firestore Database
4. See collections: `check_ins`, `workouts`

---

**Ready to build?** Run: `npm run android:dev`
