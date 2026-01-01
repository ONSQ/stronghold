// Echelon Row BLE Service
// Connects to Echelon Row rowing machine via Bluetooth Low Energy
// Reads real-time workout data: time, distance, resistance level, strokes, etc.

import { BleManager, Device, Characteristic, State } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';

// Echelon Row BLE UUIDs (these will need to be discovered from the actual device)
// For now, using standard Fitness Machine Service UUIDs
const FITNESS_MACHINE_SERVICE_UUID = '00001826-0000-1000-8000-00805f9b34fb';
const ROWER_DATA_CHARACTERISTIC = '00002ad1-0000-1000-8000-00805f9b34fb';
const FITNESS_MACHINE_CONTROL_POINT = '00002ad9-0000-1000-8000-00805f9b34fb';
const RESISTANCE_LEVEL_CHARACTERISTIC = '00002ad6-0000-1000-8000-00805f9b34fb';

export interface RowingData {
  strokeRate: number;        // strokes per minute
  strokeCount: number;        // total strokes
  distance: number;           // meters
  duration: number;           // seconds
  resistanceLevel: number;    // 1-16
  pace: number;              // seconds per 500m
  calories: number;           // estimated calories burned
  heartRate?: number;         // if available
  power?: number;            // watts, if available
  timestamp: Date;
}

class EchelonRowBLEService {
  private manager: BleManager | null = null;
  private connectedDevice: Device | null = null;
  private isScanning: boolean = false;
  private dataCallback: ((data: RowingData) => void) | null = null;

  constructor() {
    // Lazy initialization to avoid crashes in Expo Go
    // BLE requires native build, not compatible with Expo Go
    try {
      this.manager = new BleManager();
    } catch (error) {
      console.warn('BleManager not available. BLE features require development build (expo run:android)');
      this.manager = null;
    }
  }

  /**
   * Check if BLE is available (requires native build)
   */
  isAvailable(): boolean {
    return this.manager !== null;
  }

  /**
   * Request Bluetooth permissions (Android)
   */
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        // Android 12+
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        return (
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        // Android 11 and below
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true; // iOS handles permissions automatically
  }

  /**
   * Check if Bluetooth is powered on
   */
  async isBluetoothEnabled(): Promise<boolean> {
    if (!this.manager) return false;
    const state = await this.manager.state();
    return state === State.PoweredOn;
  }

  /**
   * Scan for Echelon Row devices
   */
  async scanForDevices(
    onDeviceFound: (device: Device) => void,
    timeoutMs: number = 10000
  ): Promise<void> {
    if (!this.manager) {
      throw new Error('BLE not available. Requires development build (expo run:android)');
    }

    const hasPermissions = await this.requestPermissions();
    if (!hasPermissions) {
      throw new Error('Bluetooth permissions not granted');
    }

    const isEnabled = await this.isBluetoothEnabled();
    if (!isEnabled) {
      throw new Error('Bluetooth is not enabled');
    }

    this.isScanning = true;

    // Scan for devices with Fitness Machine Service or Echelon in the name
    this.manager.startDeviceScan(
      [FITNESS_MACHINE_SERVICE_UUID],
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          console.error('BLE Scan Error:', error);
          this.stopScanning();
          return;
        }

        if (device) {
          // Filter for Echelon devices
          if (
            device.name?.toLowerCase().includes('echelon') ||
            device.name?.toLowerCase().includes('row') ||
            device.localName?.toLowerCase().includes('echelon')
          ) {
            console.log('Found Echelon device:', device.name, device.id);
            onDeviceFound(device);
          }
        }
      }
    );

    // Auto-stop scanning after timeout
    setTimeout(() => {
      if (this.isScanning) {
        this.stopScanning();
      }
    }, timeoutMs);
  }

  /**
   * Stop scanning for devices
   */
  stopScanning(): void {
    if (this.manager) {
      this.manager.stopDeviceScan();
    }
    this.isScanning = false;
  }

  /**
   * Connect to Echelon Row device
   */
  async connectToDevice(device: Device): Promise<void> {
    try {
      console.log('Connecting to device:', device.name);

      // Connect to the device
      const connectedDevice = await device.connect();
      this.connectedDevice = connectedDevice;

      console.log('Connected to:', connectedDevice.name);

      // Discover services and characteristics
      await connectedDevice.discoverAllServicesAndCharacteristics();

      console.log('Services discovered');

      // Start monitoring rowing data
      await this.startMonitoringData();

    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  /**
   * Disconnect from device
   */
  async disconnect(): Promise<void> {
    if (this.connectedDevice) {
      await this.connectedDevice.cancelConnection();
      this.connectedDevice = null;
      this.dataCallback = null;
    }
  }

  /**
   * Check if currently connected
   */
  isConnected(): boolean {
    return this.connectedDevice !== null;
  }

  /**
   * Start monitoring rowing data
   */
  private async startMonitoringData(): Promise<void> {
    if (!this.connectedDevice) {
      throw new Error('No device connected');
    }

    // Monitor the Rower Data characteristic
    this.connectedDevice.monitorCharacteristicForService(
      FITNESS_MACHINE_SERVICE_UUID,
      ROWER_DATA_CHARACTERISTIC,
      (error, characteristic) => {
        if (error) {
          console.error('Monitoring error:', error);
          return;
        }

        if (characteristic?.value) {
          const data = this.parseRowingData(characteristic);
          if (this.dataCallback && data) {
            this.dataCallback(data);
          }
        }
      }
    );
  }

  /**
   * Parse rowing data from BLE characteristic
   * Based on Bluetooth Fitness Machine Service specification
   */
  private parseRowingData(characteristic: Characteristic): RowingData | null {
    try {
      if (!characteristic.value) return null;

      // Decode base64 to buffer
      const buffer = Buffer.from(characteristic.value, 'base64');

      // Parse according to Rower Data characteristic format
      // Flags byte determines which fields are present
      const flags = buffer.readUInt8(0);

      let offset = 1;

      // Stroke Rate (strokes per minute) - 2 bytes
      const strokeRate = buffer.readUInt8(offset);
      offset += 1;

      // Stroke Count - 2 bytes
      const strokeCount = buffer.readUInt16LE(offset);
      offset += 2;

      // Total Distance - 3 bytes (in meters)
      const distance = buffer.readUIntLE(offset, 3);
      offset += 3;

      // Total Duration - 2 bytes (in seconds)
      const duration = buffer.readUInt16LE(offset);
      offset += 2;

      // Resistance Level (if available) - 1 byte
      let resistanceLevel = 5; // default
      if (flags & 0x01) {
        resistanceLevel = buffer.readUInt8(offset);
        offset += 1;
      }

      // Pace (seconds per 500m)
      const pace = distance > 0 ? (duration / (distance / 500)) : 0;

      // Estimated calories (rough estimate: ~7 cal/min for moderate rowing)
      const calories = Math.floor((duration / 60) * 7);

      return {
        strokeRate,
        strokeCount,
        distance,
        duration,
        resistanceLevel,
        pace,
        calories,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error parsing rowing data:', error);
      return null;
    }
  }

  /**
   * Set resistance level on the rowing machine
   */
  async setResistanceLevel(level: number): Promise<void> {
    if (!this.connectedDevice) {
      throw new Error('No device connected');
    }

    if (level < 1 || level > 16) {
      throw new Error('Resistance level must be between 1 and 16');
    }

    try {
      // Write to the resistance level characteristic
      // Command format: [0x01, level]
      const command = Buffer.from([0x01, level]);
      const base64Command = command.toString('base64');

      await this.connectedDevice.writeCharacteristicWithResponseForService(
        FITNESS_MACHINE_SERVICE_UUID,
        RESISTANCE_LEVEL_CHARACTERISTIC,
        base64Command
      );

      console.log(`Resistance level set to ${level}`);
    } catch (error) {
      console.error('Error setting resistance level:', error);
      throw error;
    }
  }

  /**
   * Register a callback for rowing data updates
   */
  onDataUpdate(callback: (data: RowingData) => void): void {
    this.dataCallback = callback;
  }

  /**
   * Get current rowing data (single read)
   */
  async getCurrentData(): Promise<RowingData | null> {
    if (!this.connectedDevice) {
      throw new Error('No device connected');
    }

    try {
      const characteristic = await this.connectedDevice.readCharacteristicForService(
        FITNESS_MACHINE_SERVICE_UUID,
        ROWER_DATA_CHARACTERISTIC
      );

      return this.parseRowingData(characteristic);
    } catch (error) {
      console.error('Error reading current data:', error);
      return null;
    }
  }
}

// Export singleton instance
export const echelonRowBLE = new EchelonRowBLEService();
