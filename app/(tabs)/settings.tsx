// Settings Screen

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { storageService } from '@/services/storage/asyncStorage';

export default function SettingsScreen() {
  const router = useRouter();
  const [clearing, setClearing] = useState(false);

  const handleClearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your check-ins, workouts, and progress. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: async () => {
            try {
              setClearing(true);
              await storageService.clearAllData();
              Alert.alert('Success', 'All data has been cleared. The app will reload.');
              // Force reload to refresh the UI
              setTimeout(() => {
                // App will reload on next navigation
              }, 1000);
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            } finally {
              setClearing(false);
            }
          }
        },
      ]
    );
  };

  const handleClearTodayData = async () => {
    Alert.alert(
      'Clear Today\'s Data',
      'This will delete only today\'s check-in and workout. Use this to re-test the flow.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Today',
          style: 'destructive',
          onPress: async () => {
            try {
              setClearing(true);
              await storageService.clearTodayData();
              Alert.alert('Success', 'Today\'s data has been cleared. You can now do a new check-in.');
            } catch (error) {
              console.error('Error clearing today\'s data:', error);
              Alert.alert('Error', 'Failed to clear today\'s data. Please try again.');
            } finally {
              setClearing(false);
            }
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Configure your STRONGHOLD experience</Text>

      {/* User Info */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Your Profile</Text>
        <SettingRow label="Name" value="Owen" />
        <SettingRow label="Age" value="50+" />
        <SettingRow label="Weight" value="280 lbs" />
        <SettingRow label="Medication" value="Zepbound" />
      </Card>

      {/* Equipment */}
      <TouchableOpacity onPress={() => router.push('/equipment')}>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Your Equipment</Text>
            <Text style={styles.cardAction}>Edit →</Text>
          </View>
          <SettingRow label="Rowing Machine" value="Echelon Row ✅" />
          <SettingRow label="Resistance Bands" value="Light, Medium, Heavy ✅" />
          <SettingRow label="Cable Machine" value="✅" />
          <SettingRow label="Stability Ball" value="65cm ✅" />
          <SettingRow label="Free Weights" value="5-45 lbs ✅" />
        </Card>
      </TouchableOpacity>

      {/* Preferences */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingRow label="Workout Time" value="6:30 AM" />
        <SettingRow label="Theme" value="Dark 🌙" />
        <SettingRow label="Notifications" value="Moderate" />
      </Card>

      {/* Health Integrations */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Integrations</Text>
        <SettingRow label="Galaxy Watch 4" value="Week 2 🚧" />
        <SettingRow label="Echelon Row BLE" value="Week 2 🚧" />
        <SettingRow label="Google Calendar" value="Week 2 🚧" />
      </Card>

      {/* About */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>About</Text>
        <SettingRow label="Version" value="1.0.0 MVP" />
        <SettingRow label="Built with" value="Claude Code 🤖" />
        <SettingRow label="For" value="Owen @ ONSQ" />
      </Card>

      {/* Danger Zone */}
      <Card style={[styles.card, styles.dangerCard]}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <Text style={styles.dangerNote}>⚠️ For testing: Clear today's data to re-do check-in</Text>
        <Button
          title="Clear Today's Data"
          onPress={handleClearTodayData}
          variant="secondary"
          fullWidth
          disabled={clearing}
          style={styles.dangerButton}
        />
        <Button
          title="Clear All Data"
          onPress={handleClearAllData}
          variant="danger"
          fullWidth
          disabled={clearing}
        />
      </Card>

      <Text style={styles.footer}>
        Built for consistency. Powered by AI. Made for you. 💪
      </Text>
    </ScrollView>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.settingValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
  },
  cardAction: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.primary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingLabel: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  settingValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium as any,
    color: colors.text,
  },
  dangerCard: {
    borderColor: colors.error + '50',
    backgroundColor: colors.error + '10',
  },
  dangerNote: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  dangerButton: {
    marginBottom: spacing.md,
  },
  footer: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
});
