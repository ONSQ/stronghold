// Root Layout - Tab Navigation

import { Tabs } from 'expo-router';
import { Platform, StatusBar } from 'react-native';
import { colors, fontSize } from '@/theme/colors';

// Get the status bar height
const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarPosition: 'top',
        tabBarStyle: {
          backgroundColor: colors.backgroundElevated,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
          height: 60 + statusBarHeight, // Increase height to accommodate status bar
          paddingBottom: 8,
          paddingTop: statusBarHeight + 8, // Add status bar height
          marginTop: 0,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerTitle: 'STRONGHOLD',
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color }) => <TabBarIcon name="dumbbell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color}) => <TabBarIcon name="history" color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <TabBarIcon name="chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}

// Simple icon component (using emoji for now, can be replaced with icon library)
function TabBarIcon({ name, color }: { name: string; color: string }) {
  const { Text } = require('react-native');
  const icons: Record<string, string> = {
    home: '🏠',
    dumbbell: '💪',
    history: '📅',
    chart: '📊',
    settings: '⚙️',
  };

  return (
    <Text style={{ fontSize: 24 }}>{icons[name] || '•'}</Text>
  );
}
