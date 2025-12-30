# 💪 STRONGHOLD - Your AI Workout Coach

**Built for Owen - Personalized fitness coaching with AI intelligence**

## 🎯 What is STRONGHOLD?

STRONGHOLD is your personal AI fitness coach that adapts to your body, schedule, and goals. It learns your patterns, respects your limitations (bad knee, shoulder issues), and generates daily workouts tailored to how you feel that morning.

### Key Features

- 🤖 **AI-Powered Coaching** - Claude Sonnet 4 analyzes your check-ins and generates adaptive workouts
- 💪 **Equipment Integration** - Works with your Echelon Row, resistance bands, cables, stability ball
- ⌚ **Galaxy Watch 4 Support** - Real-time heart rate monitoring and workout tracking
- 📊 **Pattern Recognition** - Learns what works for you (e.g., "rowing reduces your anxiety by 60%")
- 📅 **Calendar Integration** - Finds workout windows in your busy schedule
- 🌙 **Offline-First** - Works without internet, syncs when connected
- 🎨 **Dark Theme** - Easy on the eyes for early morning check-ins

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js 18+ required
node --version

# Install Expo CLI globally
npm install -g expo-cli
```

### Installation

```bash
# Clone the repository
git clone https://github.com/ONSQ/stronghold.git
cd stronghold

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Ensure google-services.json is in root directory (already included)

# Start the development server
npx expo start
```

### Running on Your Phone

1. **Install Expo Go** on your Galaxy S24 Ultra
2. **Scan QR code** from terminal
3. **App launches** - Start your first check-in!

OR

```bash
# Build development APK
npx expo run:android
```

## 📱 How to Use

### Morning Routine

1. **Wake up at 6:30 AM** - Get notification
2. **Quick Check-in** (2 minutes)
   - How's your knee? Shoulder? Energy? Sleep?
   - Mental state? Stress level?
   - Emotional temperature?
3. **AI Generates Workout** - Tailored to your state
4. **Start Workout** - Follow along, log sets
5. **Complete & Review** - See your progress

### Features in Action

**Check-In → AI Analysis:**
```
You: Knee 6/10, Shoulder 8/10, Stress 7/10, Sleep 5/10
AI: "Your shoulder feels good but knee is iffy and sleep was poor.
     Today: Upper body focus, moderate intensity, extra rowing 
     for stress relief. We'll skip legs entirely."
```

**Adaptive Coaching:**
```
During Set: "That looked hard - try 5 lbs lighter next set"
Exercise Swap: "Knee hurting? Let's swap to band work instead"
Motivation: "Day 12 streak! You're building real consistency"
```

## 🏗️ Project Structure

```
stronghold/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Main navigation tabs
│   ├── check-in.tsx       # Morning check-in flow
│   └── workout/[id].tsx   # Active workout session
├── src/
│   ├── components/        # Reusable UI components
│   ├── features/          # Feature-specific components
│   ├── services/          # Business logic & APIs
│   │   ├── ai/           # Claude API integration
│   │   ├── firebase/     # Cloud sync
│   │   └── bluetooth/    # Echelon Row connection
│   ├── database/         # WatermelonDB (offline-first)
│   ├── store/            # Zustand state management
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript definitions
└── assets/               # Images, icons, fonts
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for all configuration options.

Key variables:
- `EXPO_PUBLIC_ANTHROPIC_API_KEY` - Claude API key
- `EXPO_PUBLIC_FIREBASE_*` - Firebase configuration
- `EXPO_PUBLIC_DEFAULT_WORKOUT_TIME` - Default reminder time

### Firebase Setup

1. Ensure `google-services.json` is in root directory
2. Firebase Firestore should be enabled
3. Firebase Storage should be enabled

### Equipment Configuration

Edit `src/constants/equipment.ts` to match your gear:
- Echelon Row (ECH-ROW-026782)
- Resistance bands (light, medium, heavy)
- Cable machine
- Stability ball
- Free weights (5-45 lbs)

## 📊 Tech Stack

- **Framework:** React Native + Expo
- **Navigation:** Expo Router
- **AI:** Claude Sonnet 4 (Anthropic)
- **Database:** WatermelonDB (offline-first)
- **Backend:** Firebase (Firestore, Storage)
- **State:** Zustand + React Query
- **UI:** React Native Elements + Custom Components
- **TypeScript:** Full type safety

## 🐛 Troubleshooting

### App won't start
```bash
# Clear cache and restart
npx expo start -c
```

### Dependencies issues
```bash
# Clean install
rm -rf node_modules
npm install
```

### Firebase connection issues
- Verify `google-services.json` is in root
- Check `.env` has correct Firebase config
- Ensure Firestore is enabled in Firebase Console

### Bluetooth not connecting
- Enable Bluetooth on phone
- Grant location permissions (required for BLE)
- Echelon Row should be powered on
- Try "Scan for devices" in Settings

## 🗓️ Roadmap

### ✅ Week 1 (MVP)
- [x] Morning check-in flow
- [x] AI workout generation
- [x] Basic workout tracking
- [x] Dark theme
- [x] Local database

### 🚧 Week 2 (Equipment Integration)
- [ ] Echelon Row Bluetooth connection
- [ ] Galaxy Watch 4 app
- [ ] Real-time heart rate display
- [ ] Pattern recognition insights

### 📅 Future
- [ ] Google Calendar integration
- [ ] Task management sync
- [ ] Progress photos timeline
- [ ] Weekly AI summaries
- [ ] Travel mode adaptations

## 💬 Development

Built with Claude Code by Anthropic for Owen at ONSQ Enterprises.

**Repository:** https://github.com/ONSQ/stronghold

## 📄 License

Private - ONSQ Enterprises

---

**Built for consistency. Powered by AI. Made for you.** 💪
