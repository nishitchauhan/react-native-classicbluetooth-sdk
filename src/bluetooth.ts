import RNBluetoothClassic, {
  BluetoothDevice,
  BluetoothDeviceEvent,
} from "react-native-bluetooth-classic";
import { checkAllPermissions } from "./permission";
import { ToastAndroid } from "react-native";

type Subscription = {
  remove: () => void;
};

// Function to check if Bluetooth is enabled
export const isBluetoothEnabled = async () => {
  try {
    return await RNBluetoothClassic.isBluetoothEnabled();
  } catch (err) {
    console.error(err);
    throw new Error("Failed to check if Bluetooth is enabled");
  }
};

// Function to enable Bluetooth if it is not already enabled
export const enableBluetooth = async () => {
  try {
    await RNBluetoothClassic.requestBluetoothEnabled();
  } catch (error) {
    console.error("Error enabling Bluetooth", error);
    throw new Error("Failed to enable Bluetooth");
  }
};

/**
 * Initiates the Bluetooth discovery process to find unpaired devices.
 *
 * This function performs the following steps:
 * 1. Checks if Bluetooth is enabled on the device.
 * 2. Verifies that all necessary permissions are granted.
 * 3. If Bluetooth is not enabled, attempts to enable it.
 * 4. If permissions are not granted, returns the permission status.
 * 5. If both Bluetooth is enabled and permissions are granted, starts the discovery process.
 *
 * The discovery process attempts to find unpaired Bluetooth devices. If an error occurs during
 * discovery, it is logged and returned. Regardless of success or failure, the discovery process
 * is stopped in the `finally` block.
 *
 * @returns {Promise<any>} A promise that resolves to:
 * - The result of enabling Bluetooth if it was initially disabled.
 * - The permission status if permissions are not granted.
 * - A list of unpaired devices if discovery is successful.
 * - The error object if an error occurs during discovery.
 */
export const startDiscovery = async () => {
  const isBLenabled = await isBluetoothEnabled();
  const allPermission = await checkAllPermissions();
  if (!isBLenabled) {
    const enableBL = await enableBluetooth();
    return enableBL;
  } else if (!allPermission) {
    return allPermission;
  } else {
    try {
      const unpaired = await RNBluetoothClassic.startDiscovery();
      return unpaired;
    } catch (error) {
      console.error(error);
      return error;
    } finally {
      await RNBluetoothClassic.cancelDiscovery();
      console.log("Discovery stopped");
    }
  }
};

/**
 * Stops the ongoing Bluetooth discovery process.
 *
 * This function attempts to cancel the discovery process for Bluetooth devices.
 * If successful, it logs the cancellation status. If an error occurs, it displays
 * a toast message indicating the failure.
 */
export const stopDiscovery = async () => {
  try {
    const cancelled = await RNBluetoothClassic.cancelDiscovery();
    console.log(cancelled);
  } catch (error) {
    ToastAndroid.show(
      `Error occurred while attempting to cancel discover devices`,
      ToastAndroid.BOTTOM
    );
  }
};

/**
 * Connects to a Bluetooth device with the specified device ID.
 *
 * This function attempts to establish a connection to the given Bluetooth device.
 * If the connection is successful, it logs the connection status and returns the connected device.
 * If the connection fails, it displays a toast message indicating the failure and returns false.
 *
 * @param {string} deviceId - The ID of the Bluetooth device to connect to.
 * @returns {Promise<BluetoothDevice | false>} A promise that resolves to the connected device if successful, or false if the connection fails.
 */
export const connectDevice = async (deviceId: string) => {
  try {
    const connected = await RNBluetoothClassic.connectToDevice(deviceId, {
      delimiter: "\r",
    });
    if (!connected) {
      throw new Error(`Failed to connect to device: ${deviceId}`);
    }
    console.log(`Connected to device: ${deviceId}`);
    return connected;
  } catch (error) {
    ToastAndroid.show(
      `Error connecting to device: ${deviceId}`,
      ToastAndroid.BOTTOM
    );
    return false;
  }
};

/**
 * Disconnects from a Bluetooth device using its device ID.
 *
 * @param deviceId - The unique identifier of the Bluetooth device to disconnect from.
 * @returns A promise that resolves to `true` if the device was successfully disconnected,
 *          or throws an error if the disconnection fails.
 * @throws An error if the disconnection process fails or if the device cannot be disconnected.
 *
 * @example
 * ```typescript
 * try {
 *   const result = await disconnectDevice('device-id-123');
 *   console.log('Device disconnected:', result);
 * } catch (error) {
 *   console.error('Failed to disconnect device:', error);
 * }
 * ```
 */
export const disconnectDevice = async (deviceId: string) => {
  try {
    const disconnected = await RNBluetoothClassic.disconnectFromDevice(
      deviceId
    );
    if (!disconnected) {
      throw new Error(`Failed to disconnect from device: ${deviceId}`);
    }
    console.log(`Disconnected from device: ${deviceId}`);
    return disconnected;
  } catch (error) {
    console.error(`Error disconnecting from device: ${deviceId}`, error);
    throw error;
  }
};

/**
 * Pairs with a Bluetooth device using its device ID.
 *
 * This function attempts to pair with the specified Bluetooth device. If the pairing
 * is successful, it returns the paired device. If the pairing fails, it throws an error.
 *
 * @param {string} deviceId - The ID of the Bluetooth device to pair with.
 * @returns {Promise<BluetoothDevice>} A promise that resolves to the paired device if successful.
 * @throws An error if the pairing process fails.
 *
 * @example
 * ```typescript
 * try {
 *   const pairedDevice = await pairDevice('device-id-123');
 *   console.log('Device paired:', pairedDevice);
 * } catch (error) {
 *   console.error('Failed to pair device:', error);
 * }
 * ```
 */
export const pairDevice = async (deviceId: string) => {
  try {
    const paired = await RNBluetoothClassic.pairDevice(deviceId);
    if (!paired) {
      throw new Error(`Failed to pair with device: ${deviceId}`);
    }
    return paired;
  } catch (error) {
    console.error(`Error pairing with device: ${deviceId}`, error);
    throw error;
  }
};

/**
 * Unpairs a Bluetooth device by its device ID.
 *
 * @param deviceId - The unique identifier of the Bluetooth device to unpair.
 * @returns A promise that resolves to a boolean indicating whether the device was successfully unpaired.
 * @throws An error if the unpairing process fails.
 *
 * @example
 * ```typescript
 * try {
 *   const result = await unPairDevice('device-id-123');
 *   console.log('Unpairing successful:', result);
 * } catch (error) {
 *   console.error('Failed to unpair device:', error);
 * }
 * ```
 */
export const unPairDevice = async (deviceId: string) => {
  try {
    const unpaired = await RNBluetoothClassic.unpairDevice(deviceId);
    if (!unpaired) {
      throw new Error(`Failed to unpair with device: ${deviceId}`);
    }
    return unpaired;
  } catch (error) {
    console.error(`Error unpairing with device: ${deviceId}`, error);
    throw error;
  }
};

/**
 * Retrieves the list of devices that are currently paired (bonded) with the device.
 *
 * @returns {Promise<any[]>} A promise that resolves to an array of paired devices.
 * If an error occurs during retrieval, an empty array is returned.
 *
 * @throws Will log an error message to the console if the retrieval fails.
 */
export const getPairedDevices = async () => {
  try {
    const pairedDevices = await RNBluetoothClassic.getBondedDevices();
    return pairedDevices;
  } catch (err) {
    console.error("Error getting paired devices", err);
    return [];
  }
};

/**
 * Retrieves the list of currently connected Bluetooth devices.
 *
 * This function attempts to fetch the devices that are actively connected
 * to the Bluetooth system. If an error occurs during the retrieval process,
 * it logs the error and returns an empty array.
 *
 * @returns {Promise<BluetoothDevice[]>} A promise that resolves to an array of connected devices.
 * If an error occurs, an empty array is returned.
 *
 * @example
 * ```typescript
 * try {
 *   const connectedDevices = await getConnectedDevice();
 *   console.log('Connected devices:', connectedDevices);
 * } catch (error) {
 *   console.error('Failed to get connected devices:', error);
 * }
 * ```
 */
export const getConnectedDevice = async (): Promise<BluetoothDevice[]> => {
  try {
    const connectedDevices = await RNBluetoothClassic.getConnectedDevices();
    return connectedDevices;
  } catch (err) {
    console.error("Error getting connected devices", err);
    return [];
  }
};

/**
 * Retrieves the list of bonded (paired) Bluetooth devices.
 *
 * This function fetches the devices that are currently bonded with the Bluetooth system.
 * If an error occurs during the retrieval process, it logs the error and throws an exception.
 *
 * @returns {Promise<BluetoothDevice[]>} A promise that resolves to an array of bonded devices.
 * @throws Will throw an error if the retrieval fails.
 *
 * @example
 * ```typescript
 * try {
 *   const bondedDevices = await getBondedDevices();
 *   console.log('Bonded devices:', bondedDevices);
 * } catch (error) {
 *   console.error('Failed to fetch bonded devices:', error);
 * }
 * ```
 */
export const getBondedDevices = async (): Promise<BluetoothDevice[]> => {
  try {
    const bondedDevices = await RNBluetoothClassic.getBondedDevices();
    return bondedDevices;
  } catch (error) {
    console.error("Error fetching bonded devices:", error);
    throw new Error("Failed to fetch bonded devices");
  }
};

/**
 * Subscribes to the event triggered when Bluetooth is enabled.
 *
 * This function sets up a listener for the Bluetooth enabled event and invokes
 * the provided callback function when the event occurs. The subscription can be
 * removed by calling the `remove` method on the returned object.
 *
 * @param {() => void} callback - The function to be called when Bluetooth is enabled.
 * @returns {Subscription} An object with a `remove` method to unsubscribe from the event.
 *
 * @example
 * ```typescript
 * const subscription = onBluetoothEnabled(() => {
 *   console.log('Bluetooth has been enabled');
 * });
 *
 * // To remove the subscription later
 * subscription.remove();
 * ```
 */
export const onBluetoothEnabled = (callback: () => void): Subscription => {
  const subscription = RNBluetoothClassic.onBluetoothEnabled(callback);
  return subscription;
};

/**
 * Subscribes to an event that triggers when Bluetooth is disabled.
 *
 * @param callback - A function to be executed when Bluetooth is disabled.
 * @returns A subscription object that can be used to manage the event listener.
 */
export const onBluetoothDisabled = (callback: () => void): Subscription => {
  const subscription = RNBluetoothClassic.onBluetoothDisabled(callback);
  return subscription;
};

/**
 * Subscribes to the event triggered when the Bluetooth state changes.
 *
 * This function sets up a listener for Bluetooth state changes and invokes
 * the provided callback function when the state changes. The subscription can be
 * removed by calling the `remove` method on the returned object.
 *
 * @param { (event: BluetoothDeviceEvent) => void } callback - The function to be called when the Bluetooth state changes.
 * @returns { Subscription } An object with a `remove` method to unsubscribe from the event.
 *
 * @example
 * ```typescript
 * const subscription = onStateChanged((event) => {
 *   console.log('Bluetooth state changed:', event);
 * });
 *
 * // To remove the subscription later
 * subscription.remove();
 * ```
 */
export const onStateChanged = (
  callback: (event: BluetoothDeviceEvent) => void
): Subscription => {
  const subscription = RNBluetoothClassic.onStateChanged(callback);
  return subscription;
};

/**
 * Subscribes to the event triggered when a Bluetooth device is connected.
 *
 * This function sets up a listener for the device connected event and invokes
 * the provided callback function when a device is connected. The subscription can be
 * removed by calling the `remove` method on the returned object.
 *
 * @param { (device: BluetoothDeviceEvent) => void } callback - The function to be called when a device is connected.
 * @returns { Subscription } An object with a `remove` method to unsubscribe from the event.
 *
 * @example
 * ```typescript
 * const subscription = onDeviceConnected((device) => {
 *   console.log('Device connected:', device);
 * });
 *
 * // To remove the subscription later
 * subscription.remove();
 * ```
 */
export const onDeviceConnected = (
  callback: (device: BluetoothDeviceEvent) => void
): Subscription => {
  const subscription = RNBluetoothClassic.onDeviceConnected(callback);
  return subscription;
};

/**
 * Registers a callback to be invoked when a Bluetooth device is disconnected.
 *
 * @param callback - A function that will be called with a `BluetoothDeviceEvent`
 *                   when a device is disconnected.
 * @returns A `Subscription` object that can be used to remove the listener.
 */
export const onDeviceDisconnected = (
  callback: (device: BluetoothDeviceEvent) => void
): Subscription => {
  const subscription = RNBluetoothClassic.onDeviceDisconnected(callback);
  return subscription;
};

/**
 * Opens the Bluetooth settings on the device using the RNBluetoothClassic library.
 *
 * This function attempts to open the Bluetooth settings and displays a toast message
 * indicating success. If an error occurs during the process, it logs the error to the console
 * and throws a new error indicating failure.
 *
 * @throws {Error} If the Bluetooth settings cannot be opened.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export const openBluetoothSettings = async (): Promise<void> => {
  try {
    await RNBluetoothClassic.openBluetoothSettings();
    ToastAndroid.show("Bluetooth settings opened", ToastAndroid.SHORT);
  } catch (error) {
    console.error("Error opening Bluetooth settings:", error);
    throw new Error("Failed to open Bluetooth settings");
  }
};

/**
 * Cleans up an array of subscriptions by removing each subscription.
 *
 * This function iterates over the provided array of subscriptions and calls
 * the `remove` method on each subscription to unsubscribe from events.
 *
 * @param {Subscription[]} subscriptions - An array of subscription objects to be cleaned up.
 *
 * @example
 * ```typescript
 * const subscriptions = [
 *   onBluetoothEnabled(() => console.log('Bluetooth enabled')),
 *   onDeviceConnected((device) => console.log('Device connected:', device)),
 * ];
 *
 * cleanupSubscriptions(subscriptions);
 * ```
 */
export const cleanupSubscriptions = (subscriptions: Subscription[]): void => {
  subscriptions.forEach((subscription) => subscription.remove());
};

/**
 * Reads data from the specified Bluetooth device.
 *
 * @param device - The Bluetooth device to read data from.
 * @returns A promise that resolves with the data read from the device.
 * @throws An error if no device is connected or if reading data fails.
 */
export const read = async (device: BluetoothDevice): Promise<any> => {
  try {
    if (!device) throw new Error("No device connected.");
    const data = await device.read();
    console.log(`Data read from device: ${data}`);
    return data;
  } catch (error) {
    console.error("Error reading data from device:", error);
    throw new Error("Failed to read data from device");
  }
};

/**
 * Writes data to the specified Bluetooth device.
 *
 * This function attempts to send the provided data to the connected Bluetooth device.
 * If the operation is successful, it logs the data written to the device. If the operation
 * fails, it throws an error indicating the failure.
 *
 * @param {BluetoothDevice} device - The Bluetooth device to write data to.
 * @param {string} data - The data to be written to the device.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the data was successfully written, or throws an error if the operation fails.
 *
 * @throws Will throw an error if no device is connected or if writing data fails.
 *
 * @example
 * ```typescript
 * try {
 *   const success = await write(device, "Hello, Bluetooth!");
 *   console.log("Write operation successful:", success);
 * } catch (error) {
 *   console.error("Failed to write data:", error);
 * }
 * ```
 */
export const write = async (
  device: BluetoothDevice,
  data: string
): Promise<boolean> => {
  try {
    if (!device) throw new Error("No device connected.");
    const success = await device.write(data);
    if (success) {
      console.log(`Data written to device: ${data}`);
    }
    return success;
  } catch (error) {
    console.error(`Error writing data to device: ${data}`, error);
    throw new Error("Failed to write data to device");
  }
};

/**
 * Checks the number of bytes available to read from a connected Bluetooth device.
 *
 * @param device - The Bluetooth device to check for available bytes.
 * @returns A promise that resolves to the number of bytes available to read.
 * @throws An error if no device is connected or if the operation fails.
 */
export const available = async (device: BluetoothDevice): Promise<number> => {
  try {
    if (!device) throw new Error("No device connected.");
    const bytesAvailable = await device.available();
    console.log(`Bytes available to read: ${bytesAvailable}`);
    return bytesAvailable;
  } catch (error) {
    console.error("Error checking available bytes:", error);
    throw new Error("Failed to check available bytes");
  }
};

/**
 * Clears the buffer of the specified Bluetooth device.
 *
 * This function attempts to clear the buffer of the connected Bluetooth device.
 * If the operation is successful, it logs a message indicating the buffer was cleared.
 * If the operation fails, it throws an error indicating the failure.
 *
 * @param {BluetoothDevice} device - The Bluetooth device whose buffer is to be cleared.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the buffer was successfully cleared, or throws an error if the operation fails.
 *
 * @throws Will throw an error if no device is connected or if clearing the buffer fails.
 *
 * @example
 * ```typescript
 * try {
 *   const success = await clear(device);
 *   console.log("Buffer cleared successfully:", success);
 * } catch (error) {
 *   console.error("Failed to clear buffer:", error);
 * }
 * ```
 */
export const clear = async (device: BluetoothDevice): Promise<boolean> => {
  try {
    if (!device) throw new Error("No device connected.");
    const cleared = await device.clear();
    console.log("Buffer cleared");
    return cleared;
  } catch (error) {
    console.error("Error clearing buffer:", error);
    throw new Error("Failed to clear buffer");
  }
};
