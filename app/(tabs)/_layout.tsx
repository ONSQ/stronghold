// Root Layout - Tab Navigation

import { Tabs } from 'expo-router';
import { colors, fontSize } from '@/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.backgroundElevated,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: fontSize.xs,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: colors.backgroundElevated,
          borderBottomColor: colors.border,
          borderBottomWidth: 1,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontSize: fontSize.xl,
          fontWeight: '700',
        },
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
  const icons: Record<string, string> = {
    home: '🏠',
    dumbbell: '💪',
    chart: '📊',
    settings: '⚙️',
  };
  
  return (
    <span style={{ fontSize: 24 }}>{icons[name] || '•'}</span>
  );
}
