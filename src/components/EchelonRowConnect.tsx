// Echelon Row Connection Component
// UI for connecting to Echelon Row and displaying real-time data

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { colors, fontSize, fontWeight, spacing, borderRadius } from '@/theme/colors';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { echelonRowBLE, RowingData } from '@/services/echelonRowBLE';
import { Device } from 'react-native-ble-plx';

interface EchelonRowConnectProps {
  visible: boolean;
  onClose: () => void;
  onDataUpdate?: (data: RowingData) => void;
  autoUseData?: boolean; // If true, automatically use BLE data for workout logging
}

export default function EchelonRowConnect({
  visible,
  onClose,
  onDataUpdate,
  autoUseData = false,
}: EchelonRowConnectProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentData, setCurrentData] = useState<RowingData | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [bleAvailable, setBleAvailable] = useState(true);

  useEffect(() => {
    if (visible) {
      // Check if BLE is available
      setBleAvailable(echelonRowBLE.isAvailable());
      // Check if already connected
      setIsConnected(echelonRowBLE.isConnected());
    }
  }, [visible]);

  useEffect(() => {
    if (isConnected) {
      // Register data callback
      echelonRowBLE.onDataUpdate((data) => {
        setCurrentData(data);
        if (onDataUpdate) {
          onDataUpdate(data);
        }
      });
    }
  }, [isConnected, onDataUpdate]);

  const handleStartScan = async () => {
    try {
      setConnectionError(null);
      setDevices([]);
      setIsScanning(true);

      await echelonRowBLE.scanForDevices(
        (device) => {
          setDevices((prev) => {
            // Avoid duplicates
            if (prev.some(d => d.id === device.id)) {
              return prev;
            }
            return [...prev, device];
          });
        },
        15000 // 15 second scan
      );

      setTimeout(() => {
        setIsScanning(false);
      }, 15000);

    } catch (error: any) {
      setIsScanning(false);
      setConnectionError(error.message);
      Alert.alert('Scan Error', error.message);
    }
  };

  const handleConnectToDevice = async (device: Device) => {
    try {
      setConnectionError(null);
      echelonRowBLE.stopScanning();
      setIsScanning(false);

      await echelonRowBLE.connectToDevice(device);
      setIsConnected(true);

      Alert.alert('Connected', `Connected to ${device.name || 'Echelon Row'}`);

    } catch (error: any) {
      setConnectionError(error.message);
      Alert.alert('Connection Error', error.message);
    }
  };

  const handleDisconnect = async () => {
    try {
      await echelonRowBLE.disconnect();
      setIsConnected(false);
      setCurrentData(null);
      Alert.alert('Disconnected', 'Disconnected from Echelon Row');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleUseCurrentData = () => {
    if (currentData && onDataUpdate) {
      onDataUpdate(currentData);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Echelon Row</Text>
            <Text style={styles.subtitle}>
              {isConnected ? 'Connected via Bluetooth' : 'Connect to your rowing machine'}
            </Text>
          </View>

          {!isConnected ? (
            <>
              {/* BLE Not Available Warning */}
              {!bleAvailable ? (
                <Card style={styles.warningCard}>
                  <Text style={styles.warningTitle}>⚠️ BLE Not Available</Text>
                  <Text style={styles.warningText}>
                    Bluetooth Low Energy requires a development build. Expo Go doesn't support native BLE modules.
                  </Text>
                  <Text style={styles.warningText}>
                    To use Echelon Row integration, run:{'\n'}
                    <Text style={styles.codeText}>npm run android:dev</Text>
                  </Text>
                  <Text style={styles.warningHint}>
                    For now, you can manually enter rowing data.
                  </Text>
                </Card>
              ) : (
                <>
                  {/* Scan Controls */}
                  <Button
                    title={isScanning ? 'Scanning...' : 'Scan for Devices'}
                    onPress={handleStartScan}
                    disabled={isScanning}
                    fullWidth
                    style={styles.scanButton}
                  />
                </>
              )}

              {/* Error Message */}
              {bleAvailable && connectionError && (
                <Card style={styles.errorCard}>
                  <Text style={styles.errorText}>⚠️ {connectionError}</Text>
                </Card>
              )}

              {/* Device List */}
              {bleAvailable && (
                <ScrollView style={styles.deviceList}>
                {isScanning && devices.length === 0 ? (
                  <View style={styles.scanningContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.scanningText}>Searching for Echelon Row...</Text>
                    <Text style={styles.scanningHint}>
                      Make sure your rowing machine is powered on and in pairing mode
                    </Text>
                  </View>
                ) : devices.length === 0 ? (
                  <Text style={styles.noDevices}>
                    No devices found. Make sure your Echelon Row is powered on and nearby.
                  </Text>
                ) : (
                  devices.map((device) => (
                    <TouchableOpacity
                      key={device.id}
                      onPress={() => handleConnectToDevice(device)}
                    >
                      <Card style={styles.deviceCard}>
                        <Text style={styles.deviceName}>
                          {device.name || 'Unknown Device'}
                        </Text>
                        <Text style={styles.deviceId}>{device.id}</Text>
                      </Card>
                    </TouchableOpacity>
                  ))
                )}
                </ScrollView>
              )}
            </>
          ) : (
            <>
              {/* Connected - Show Live Data */}
              <Card style={styles.dataCard}>
                <Text style={styles.dataTitle}>Live Rowing Data</Text>

                {currentData ? (
                  <View style={styles.dataGrid}>
                    <DataItem label="Duration" value={formatDuration(currentData.duration)} />
                    <DataItem label="Distance" value={`${currentData.distance}m`} />
                    <DataItem label="Stroke Rate" value={`${currentData.strokeRate} SPM`} />
                    <DataItem label="Resistance" value={`Level ${currentData.resistanceLevel}`} />
                    <DataItem label="Pace" value={formatPace(currentData.pace)} />
                    <DataItem label="Calories" value={`${currentData.calories} cal`} />
                    <DataItem label="Strokes" value={`${currentData.strokeCount}`} />
                  </View>
                ) : (
                  <View style={styles.noDataContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.noDataText}>Waiting for data...</Text>
                  </View>
                )}
              </Card>

              {/* Actions */}
              {autoUseData && currentData && (
                <Button
                  title="Use This Data"
                  onPress={handleUseCurrentData}
                  fullWidth
                  style={styles.actionButton}
                />
              )}

              <Button
                title="Disconnect"
                onPress={handleDisconnect}
                variant="secondary"
                fullWidth
                style={styles.actionButton}
              />
            </>
          )}

          {/* Close Button */}
          <Button title="Close" onPress={onClose} variant="outline" fullWidth />
        </View>
      </View>
    </Modal>
  );
}

// Data Item Component
function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.dataItem}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{value}</Text>
    </View>
  );
}

// Format duration (seconds to MM:SS)
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Format pace (seconds per 500m to MM:SS/500m)
function formatPace(seconds: number): string {
  if (!isFinite(seconds)) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}/500m`;
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '90%',
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  scanButton: {
    marginBottom: spacing.md,
  },
  warningCard: {
    backgroundColor: colors.warning + '20',
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  warningTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.warning,
    marginBottom: spacing.sm,
  },
  warningText: {
    fontSize: fontSize.sm,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: colors.backgroundElevated,
    padding: spacing.xs,
    fontSize: fontSize.xs,
  },
  warningHint: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  errorCard: {
    backgroundColor: colors.error + '20',
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
  },
  deviceList: {
    flex: 1,
    marginBottom: spacing.lg,
  },
  scanningContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  scanningText: {
    fontSize: fontSize.md,
    color: colors.text,
    marginTop: spacing.md,
  },
  scanningHint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  noDevices: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  deviceCard: {
    marginBottom: spacing.sm,
  },
  deviceName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  deviceId: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  dataCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary + '10',
  },
  dataTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
    marginBottom: spacing.md,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  dataItem: {
    width: '48%',
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  dataLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  dataValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.text,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  noDataText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  actionButton: {
    marginBottom: spacing.md,
  },
});
