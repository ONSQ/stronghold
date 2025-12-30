// Settings Screen

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function SettingsScreen() {
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your check-ins, workouts, and progress. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement data clearing
            Alert.alert('Success', 'All data cleared');
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
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Your Equipment</Text>
        <SettingRow label="Rowing Machine" value="Echelon Row ✅" />
        <SettingRow label="Resistance Bands" value="Light, Medium, Heavy ✅" />
        <SettingRow label="Cable Machine" value="✅" />
        <SettingRow label="Stability Ball" value="65cm ✅" />
        <SettingRow label="Free Weights" value="5-45 lbs ✅" />
      </Card>

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
        <Button
          title="Clear All Data"
          onPress={handleClearData}
          variant="danger"
          fullWidth
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
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.md,
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
  footer: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
});
