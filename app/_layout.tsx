// App Root Layout

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, fontSize } from '@/theme/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.backgroundElevated,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontSize: fontSize.xl,
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="check-in"
          options={{
            title: 'Morning Check-In',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="workout/[id]"
          options={{
            title: 'Workout',
          }}
        />
      </Stack>
    </>
  );
}
