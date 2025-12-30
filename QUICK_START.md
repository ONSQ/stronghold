# STRONGHOLD - QUICK START COMMANDS

**Copy and paste these commands to get STRONGHOLD on GitHub and running!**

---

## 📤 PUSH TO GITHUB (Do This First)

### On Your Machine:

```bash
# Navigate to where you want the project
cd ~/projects  # or wherever you keep code

# Copy all files from /tmp/stronghold to your local directory
# (You'll need to do this manually or I can create a tar file)

# Once files are local, run:
cd stronghold

# Make deploy script executable
chmod +x deploy-to-github.sh

# Run deployment script
./deploy-to-github.sh
```

**The script will:**
1. ✅ Initialize git
2. ✅ Add all files
3. ✅ Create initial commit
4. ✅ Push to https://github.com/ONSQ/stronghold
5. ✅ Set up main branch

---

## 🔧 INSTALL & RUN (After GitHub Push)

### On Your Development Machine:

```bash
# Clone the repository
git clone https://github.com/ONSQ/stronghold.git
cd stronghold

# Install dependencies (takes 5-10 minutes)
npm install

# Copy environment file (already has your keys!)
cp .env.example .env

# Verify google-services.json exists
ls -la google-services.json

# Start Expo development server
npx expo start
```

---

## 📱 RUN ON YOUR PHONE

### Option A: Expo Go (Fastest)

```bash
# After 'npx expo start', you'll see a QR code
# 1. Open Expo Go app on Galaxy S24 Ultra
# 2. Scan QR code
# 3. App loads and runs
```

### Option B: Development Build (More Stable)

```bash
# Connect phone via USB
# Enable USB debugging on phone

# Build and install
npx expo run:android
```

---

## 🐛 IF SOMETHING BREAKS

### Clear everything and start fresh:

```bash
# Clear node modules
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install

# Clear Metro cache
npx expo start -c
```

### Git issues:

```bash
# If "remote already exists"
git remote remove origin
git remote add origin https://github.com/ONSQ/stronghold.git

# If "branch already exists"
git branch -D main
git checkout -b main
```

---

## 🔄 DAILY WORKFLOW (After Initial Setup)

### Pull latest changes:
```bash
cd stronghold
git pull
npm install  # if dependencies changed
npx expo start
```

### When I fix bugs in Claude Code:
```bash
# I'll tell you: "Fixed! Pull the latest"
git pull
# Metro will auto-reload, or restart with:
npx expo start -c
```

---

## 📋 TESTING CHECKLIST

### After first install, test these:

```bash
# Start app
npx expo start

# On phone, verify:
1. [ ] App opens (dark theme)
2. [ ] See "STRONGHOLD" header
3. [ ] Tap "Start Check-In"
4. [ ] Complete Physical check (sliders work)
5. [ ] Tap "Next: Mental Check"
6. [ ] Complete Mental check
7. [ ] Tap "Next: Emotional Check"
8. [ ] Complete Emotional check
9. [ ] Tap "Generate Workout"
10. [ ] See "Analyzing..." screen
11. [ ] AI generates workout (THIS IS THE BIG TEST)
12. [ ] Workout displays with exercises
13. [ ] Can navigate tabs
14. [ ] Settings shows your info
```

---

## 📝 REPORTING ISSUES TO ME

### When something breaks:

```bash
# Copy the error from terminal
# Send me:

❌ ISSUE: [What broke]

STEPS TO REPRODUCE:
1. [Step 1]
2. [Step 2]
3. [What happened]

ERROR MESSAGE:
[Paste error from terminal]

EXPECTED:
[What should happen]
```

### Example:

```
❌ ISSUE: App crashes on "Generate Workout"

STEPS:
1. Complete all check-in steps
2. Tap "Generate Workout"
3. See "Analyzing..." for 2 seconds
4. App closes

ERROR:
TypeError: Cannot read property 'map' of undefined
  at WorkoutGenerator.parseWorkoutFromAI

EXPECTED:
Should show generated workout with exercises
```

---

## 🚀 NEXT STEPS AFTER INSTALL

**Today (Testing):**
1. Push to GitHub
2. Install locally
3. Run on phone
4. Test check-in flow
5. Report any issues

**Tomorrow (Development in Claude Code):**
1. I fix bugs you found
2. Add workout tracking
3. Add set/rep logging
4. Add rest timers
5. You test each feature

**Week 2 (Equipment):**
1. Echelon Row Bluetooth
2. Galaxy Watch app
3. Biometric tracking

---

## 💡 PRO TIPS

**Speed up development:**
```bash
# Keep Metro running in one terminal
npx expo start

# Open another terminal for git commands
git pull
git status
```

**Phone not connecting?**
```bash
# Use tunnel mode if on different networks
npx expo start --tunnel
```

**Want to see logs?**
```bash
# Android logs
npx react-native log-android

# Or use adb
adb logcat | grep ReactNative
```

---

## ✅ READY CHECKLIST

Before we move to Claude Code, make sure:

- [ ] All files are on your local machine
- [ ] Pushed to GitHub successfully
- [ ] Can see repo at https://github.com/ONSQ/stronghold
- [ ] Cloned repo to development machine
- [ ] Ran `npm install` successfully
- [ ] Ran `npx expo start` and see QR code
- [ ] Have Expo Go installed on Galaxy S24 Ultra
- [ ] Phone and computer on same WiFi

---

## 🎯 GOAL FOR TODAY

**Simple:** Get one successful check-in → AI workout generation working on your phone.

That's it. Just prove the core flow works. Everything else we can fix/add tomorrow in Claude Code!

---

**Questions? Issues? Just tell me and we'll fix it!** 💪🚀
