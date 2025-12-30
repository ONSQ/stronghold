# STRONGHOLD - SETUP INSTRUCTIONS

**Repository:** https://github.com/ONSQ/stronghold  
**Status:** MVP Ready for Testing  
**Created:** December 28, 2024

---

## 🎉 WHAT'S BEEN BUILT

### ✅ Complete MVP Features (35 files created)

**Infrastructure:**
- ✅ Complete project configuration (Expo, TypeScript, Firebase)
- ✅ Offline-first database (WatermelonDB)
- ✅ AI integration (Claude Sonnet 4 API)
- ✅ Dark theme throughout
- ✅ State management (Zustand)
- ✅ Type safety (TypeScript)

**Core Features:**
- ✅ Morning check-in flow (Physical, Mental, Emotional)
- ✅ AI workout generation based on check-in
- ✅ Exercise library (50+ exercises with YOUR equipment)
- ✅ Home dashboard with streak tracking
- ✅ Tab navigation (Home, Workouts, Progress, Settings)
- ✅ Settings screen with your profile

**AI Coach:**
- ✅ Claude API client configured for YOU specifically
- ✅ Workout generator that adapts to:
  - Knee and shoulder pain levels
  - Energy and sleep quality
  - Stress and anxiety levels
  - Your specific equipment
- ✅ Coaching tone: Encouraging, realistic, safety-first

---

## 🚀 INSTALLATION INSTRUCTIONS

### Prerequisites

**1. Install Node.js 18+**
```bash
# Check if installed
node --version

# If not installed, download from:
# https://nodejs.org/
```

**2. Install Expo CLI**
```bash
npm install -g expo-cli
```

**3. Install Expo Go on Your Phone**
- Open Play Store on Galaxy S24 Ultra
- Search "Expo Go"
- Install

---

### Step 1: Clone Repository (5 minutes)

```bash
# Clone your repo
git clone https://github.com/ONSQ/stronghold.git
cd stronghold

# Install all dependencies (this takes 5-10 minutes)
npm install
```

**Expected output:**
```
added 1247 packages in 8m
```

---

### Step 2: Configure Environment (2 minutes)

```bash
# Copy environment template
cp .env.example .env

# Verify your API keys are there
cat .env
```

**The .env file already contains your keys:**
- ✅ Anthropic API Key
- ✅ Firebase configuration
- ✅ Google OAuth Client ID

**No changes needed!**

---

### Step 3: Add Firebase Config (1 minute)

The `google-services.json` file should already be in the root directory.

```bash
# Verify it exists
ls -la google-services.json

# Should show:
# -rw-r--r-- 1 user user 1234 Dec 28 google-services.json
```

---

### Step 4: Start Development Server (1 minute)

```bash
# Start Expo
npx expo start
```

**You'll see:**
```
› Metro waiting on exp://192.168.1.x:8081
› Scan the QR code above with Expo Go (Android)

Press a │ open Android
Press w │ open web

Press r │ reload app
Press m │ toggle menu
Press ? │ show all commands
```

---

### Step 5: Run on Your Phone (1 minute)

**Option A: Expo Go (Fastest)**
1. Open Expo Go app on Galaxy S24 Ultra
2. Scan QR code from terminal
3. App loads and runs

**Option B: Development Build (More Realistic)**
```bash
# Build and install on connected phone
npx expo run:android
```

---

## 🎯 WHAT TO TEST

### First Run Checklist:

**1. App Launches**
- [ ] App opens without crashing
- [ ] Dark theme is applied
- [ ] Bottom navigation shows 4 tabs

**2. Home Screen**
- [ ] Shows "STRONGHOLD" header
- [ ] Shows streak counter (0 initially)
- [ ] Shows "Start Check-In" button

**3. Check-In Flow**
- [ ] Tap "Start Check-In"
- [ ] Physical check (knee, shoulder, energy, sleep sliders work)
- [ ] Tap "Next: Mental Check"
- [ ] Mental check (can select state, adjust stress/clarity)
- [ ] Tap "Next: Emotional Check"
- [ ] Emotional check (can select emotion, adjust intensity)
- [ ] Tap "Generate Workout"
- [ ] See "Analyzing..." screen
- [ ] **AI generates workout** (this tests Claude API)

**4. Workout Display**
- [ ] Workout appears with exercises
- [ ] Shows AI reasoning for workout
- [ ] Shows coaching notes
- [ ] Exercises are appropriate for your check-in

**5. Navigation**
- [ ] Can navigate between tabs
- [ ] Settings shows your profile correctly
- [ ] All screens load without crashing

---

## 🐛 TROUBLESHOOTING

### "Metro bundler failed to start"
```bash
# Clear cache and restart
npx expo start -c
```

### "Cannot connect to dev server"
```bash
# Make sure phone and computer are on same WiFi
# Or use tunnel mode:
npx expo start --tunnel
```

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### "Firebase error"
```bash
# Verify google-services.json is in root directory
ls -la google-services.json

# Verify .env has Firebase config
cat .env | grep FIREBASE
```

### "Claude API error"
```bash
# Verify Anthropic API key
cat .env | grep ANTHROPIC

# Test key is valid (should show "sk-ant-api03-...")
```

### App crashes on check-in
- Check console for errors
- Verify internet connection (AI needs network)
- Check Anthropic API key is valid

---

## 📱 KNOWN LIMITATIONS (MVP)

**What Works:**
- ✅ Check-in flow
- ✅ AI workout generation
- ✅ Basic navigation
- ✅ Dark theme
- ✅ Streak counter (calculated from workouts)

**What's NOT Implemented Yet:**
- ❌ Actual workout tracking (displays workout but can't log sets yet)
- ❌ Workout history list
- ❌ Progress charts
- ❌ Notifications
- ❌ Echelon Row Bluetooth (Week 2)
- ❌ Galaxy Watch app (Week 2)
- ❌ Google Calendar integration (Week 2)

**This is EXPECTED for MVP!** The core flow works:
1. Check-in → 2. AI generates workout → 3. Display workout

---

## 🔄 REPORTING ISSUES

**When you find a bug, tell me:**

```
❌ ISSUE: [Short description]

STEPS TO REPRODUCE:
1. [First step]
2. [Second step]
3. [What happened]

EXPECTED: [What should happen]
ACTUAL: [What actually happened]

ERROR MESSAGE (if shown):
[Copy/paste any error text]

SCREENSHOT: [If possible]
```

**Example:**
```
❌ ISSUE: App crashes when tapping "Generate Workout"

STEPS:
1. Complete check-in (Physical, Mental, Emotional)
2. Tap "Generate Workout" button
3. App shows "Analyzing..." then closes

EXPECTED: Should generate workout and show it
ACTUAL: App crashes to home screen

ERROR: [Copy from console if visible]
```

---

## 📊 WHAT'S NEXT

### Tonight (After Your Testing):
- Fix any bugs you find
- Polish UI based on your feedback
- Ensure AI workout generation works perfectly

### Tomorrow (Sunday):
- Add actual workout tracking (log sets/reps)
- Add rest timers
- Add post-workout feedback
- Polish check-in flow

### Monday-Tuesday:
- Workout history list
- Database persistence working smoothly
- Notifications for 6:30 AM
- You start using it for REAL

### Week 2:
- Echelon Row Bluetooth integration
- Galaxy Watch 4 app
- Real-time heart rate display
- Pattern insights

---

## 🎯 SUCCESS CRITERIA FOR TONIGHT

**Minimum Success:**
- ✅ App installs and launches
- ✅ Check-in flow completes without crashing
- ✅ AI generates a workout (proves Claude API works)
- ✅ Workout displays with exercises

**Ideal Success:**
- ✅ Everything above +
- ✅ No major bugs or crashes
- ✅ UI feels good (dark theme, navigation smooth)
- ✅ AI workout makes sense for check-in data
- ✅ You're excited to use it Monday!

---

## 💪 LET'S DO THIS!

**Your personal AI workout coach is ready to test!**

1. Follow the installation steps above
2. Test the check-in flow
3. See the AI generate your workout
4. Report any issues you find
5. Tomorrow we polish and add the rest!

**Questions?** Just ask!

---

**Built for you. By AI. With Claude Code.** 🚀💪
