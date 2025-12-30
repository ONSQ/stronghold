# CLAUDE CODE WORKFLOW GUIDE

**Now that the MVP is built, we'll use Claude Code for iterative development, bug fixes, and feature additions.**

---

## 🎯 WHY CLAUDE CODE NOW?

**Claude Code is perfect for:**
- ✅ Running terminal commands (`npm install`, `npx expo start`)
- ✅ Testing code as we build
- ✅ Debugging errors in real-time
- ✅ Iterative development (build → test → fix → repeat)
- ✅ Adding features one at a time
- ✅ Making quick edits based on your feedback

---

## 🔄 WORKFLOW: GITHUB → CLAUDE CODE → YOU

### **The Development Loop:**

```
1. You test app on your phone
   ↓
2. You report: "Bug: Check-in crashes on Mental step"
   ↓
3. I fix in Claude Code:
   - Edit app/check-in.tsx
   - Test locally
   - Commit fix
   - Push to GitHub
   ↓
4. You pull latest code
   ↓
5. You test again
   ↓
6. Repeat until feature is solid
```

---

## 📁 PROJECT STRUCTURE FOR CLAUDE CODE

When working in Claude Code, I'll have access to:

```
stronghold/
├── package.json              # I can modify dependencies
├── app/                      # I can edit screens
├── src/                      # I can edit components/services
├── assets/                   # I can add images
└── [all other files]         # Full read/write access
```

**I can:**
- ✅ Edit any file
- ✅ Create new files
- ✅ Run `npm install`
- ✅ Run `npx expo start`
- ✅ Test changes
- ✅ Git commit & push
- ✅ Debug errors

---

## 🚀 HOW TO WORK WITH ME IN CLAUDE CODE

### **Pattern 1: Bug Reports**

**You say:**
```
❌ ISSUE: App crashes when I tap "Generate Workout"

STEPS:
1. Complete check-in
2. Tap "Generate Workout"
3. App shows "Analyzing..." then crashes

ERROR: "Cannot read property 'exercises' of undefined"
```

**I do:**
1. Open `src/services/ai/workoutGenerator.ts`
2. Find the bug (missing null check)
3. Fix it:
```typescript
// Before
const exercises = workout.exercises.map(...)

// After
const exercises = workout?.exercises?.map(...) || []
```
4. Test locally
5. Commit: `git commit -m "Fix: Handle null workout in generator"`
6. Push: `git push`

**You do:**
```bash
git pull
npx expo start
# Test again
```

---

### **Pattern 2: Feature Requests**

**You say:**
```
Can you add a "Skip Exercise" button during workouts?
```

**I do:**
1. Open `app/workout/[id].tsx`
2. Add skip button:
```typescript
<Button
  title="Skip Exercise"
  onPress={() => workoutStore.skipExercise('Pain too high')}
  variant="secondary"
/>
```
3. Test it works
4. Commit & push

**You do:**
```bash
git pull
# Test the new feature
```

---

### **Pattern 3: Incremental Features**

**You say:**
```
Let's add workout tracking today. Start with just the exercise display.
```

**I do:**
1. Create `src/features/workout/ExerciseDisplay.tsx`
2. Show you what I built
3. You test
4. You say: "Good, now add set logging"
5. I add `src/features/workout/SetLogger.tsx`
6. You test
7. Continue until feature is complete

---

## 📋 TYPICAL DEVELOPMENT SESSION

### **Session 1: Initial Testing (Tonight)**

**Goal:** Get app running on your phone, find bugs

**You:**
1. Clone repo
2. Run `npm install`
3. Run `npx expo start`
4. Test check-in flow
5. Report bugs

**Me (in Claude Code):**
1. Fix bugs you report
2. Test fixes
3. Push updates
4. You pull and test again

**Duration:** 1-2 hours of back-and-forth

---

### **Session 2: Workout Tracking (Tomorrow)**

**Goal:** Add full workout tracking

**Me (in Claude Code):**
1. Create active workout screen
2. Add set/rep logging
3. Add rest timers
4. Add completion flow
5. Test each piece
6. Push working version

**You:**
1. Pull code
2. Test each feature
3. Report issues
4. I fix immediately
5. You test again

**Duration:** 2-3 hours to complete feature

---

### **Session 3: Equipment Integration (Week 2)**

**Goal:** Connect Echelon Row via Bluetooth

**Me (in Claude Code):**
1. Implement Bluetooth scanning
2. Test connection (you'll need to help test with actual device)
3. Parse rowing metrics
4. Display data
5. Debug connection issues together

**Duration:** Half day of testing and refinement

---

## 🛠️ COMMANDS I'LL RUN IN CLAUDE CODE

**Development:**
```bash
npm install                    # Install dependencies
npx expo start                 # Start dev server
npx expo start -c              # Clear cache and start
npm run lint                   # Check for errors
npm run type-check             # TypeScript checking
```

**Testing:**
```bash
npx expo run:android           # Build and run on device
npx expo run:android --variant debug
```

**Git:**
```bash
git status                     # Check changes
git add .                      # Stage changes
git commit -m "Fix: ..."       # Commit with message
git push                       # Push to GitHub
git pull                       # Pull latest
```

**Debugging:**
```bash
npx react-native log-android   # View Android logs
adb logcat                     # Android debug logs
```

---

## 🎯 YOUR ROLE IN CLAUDE CODE WORKFLOW

**You provide:**
1. ✅ Testing on real device (Galaxy S24 Ultra)
2. ✅ Bug reports with clear steps
3. ✅ Feature requests
4. ✅ Feedback on UI/UX
5. ✅ Validation that fixes work
6. ✅ Real-world usage insights

**You DON'T need to:**
- ❌ Write any code (unless you want to)
- ❌ Understand TypeScript (I handle that)
- ❌ Debug errors (I do that)
- ❌ Worry about deployment (I manage that)

---

## 📊 TRACKING PROGRESS

**I'll maintain a PROGRESS.md file:**

```markdown
# STRONGHOLD - Development Progress

## Week 1: MVP (Dec 28 - Jan 3)

### Day 1 (Dec 28) ✅
- [x] Project setup
- [x] Check-in flow
- [x] AI integration
- [x] Initial testing

### Day 2 (Dec 29) 🚧
- [ ] Bug fixes from testing
- [ ] Workout tracking UI
- [ ] Set logging
- [ ] Rest timers

### Day 3 (Dec 30) ⏳
- [ ] Workout completion
- [ ] History list
- [ ] Database refinement

...
```

---

## 🔄 TYPICAL BUG FIX CYCLE

**Average time: 5-15 minutes**

1. You: "Button doesn't work"
2. Me: "Looking at the code..."
3. Me: "Found it - missing onPress handler"
4. Me: *fixes code*
5. Me: "Fixed! Pushing now."
6. Me: `git push`
7. You: `git pull`
8. You: "Works now! ✅"

---

## 🚀 READY TO START?

**Immediate Next Steps:**

1. **Push to GitHub** (use the deploy script)
2. **Clone on your machine**
3. **Install & run**
4. **Test & report issues**
5. **I fix in Claude Code**
6. **Repeat until perfect**

---

## 💬 HOW TO COMMUNICATE IN CLAUDE CODE

**Keep it simple and direct:**

✅ Good:
- "Add skip button to workout screen"
- "App crashes on mental check step"
- "Can we make the sliders bigger?"
- "This button should be red not orange"

❌ Too vague:
- "Something's wrong"
- "It doesn't work"
- "Can you make it better?"

**The more specific, the faster I can fix!**

---

## 🎯 TODAY'S GOAL

**Get it working on your phone!**

1. Push code to GitHub ← Do this now
2. Clone locally
3. Install dependencies
4. Run on your phone
5. Complete one full check-in → workout generation
6. Report what works / what doesn't

**Then we iterate in Claude Code tomorrow!**

---

**Ready? Let's push to GitHub!** 🚀
