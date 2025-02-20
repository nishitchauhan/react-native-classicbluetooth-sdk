"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.write = exports.unPairDevice = exports.stopDiscovery = exports.startDiscovery = exports.read = exports.pairDevice = exports.openBluetoothSettings = exports.onStateChanged = exports.onDeviceDisconnected = exports.onDeviceConnected = exports.onBluetoothEnabled = exports.onBluetoothDisabled = exports.isBluetoothEnabled = exports.getPairedDevices = exports.getConnectedDevice = exports.getBondedDevices = exports.enableBluetooth = exports.disconnectDevice = exports.connectDevice = exports.clear = exports.cleanupSubscriptions = exports.available = void 0;
var _reactNativeBluetoothClassic = _interopRequireDefault(require("react-native-bluetooth-classic"));
var _permission = require("./permission");
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const isBluetoothEnabled = async () => {
  try {
    return await _reactNativeBluetoothClassic.default.isBluetoothEnabled();
  } catch (err) {
    console.error(err);
    throw new Error("Failed to check if Bluetooth is enabled");
  }
};
exports.isBluetoothEnabled = isBluetoothEnabled;
const enableBluetooth = async () => {
  try {
    await _reactNativeBluetoothClassic.default.requestBluetoothEnabled();
  } catch (error) {
    console.error("Error enabling Bluetooth", error);
    throw new Error("Failed to enable Bluetooth");
  }
};
exports.enableBluetooth = enableBluetooth;
const startDiscovery = async () => {
  const isBLenabled = await isBluetoothEnabled();
  const allPermission = await (0, _permission.checkAllPermissions)();
  if (!isBLenabled) {
    const enableBL = await enableBluetooth();
    return enableBL;
  } else if (!allPermission) {
    return allPermission;
  } else {
    try {
      const unpaired = await _reactNativeBluetoothClassic.default.startDiscovery();
      return unpaired;
    } catch (error) {
      console.error(error);
      return error;
    } finally {
      await _reactNativeBluetoothClassic.default.cancelDiscovery();
      console.log("Discovery stopped");
    }
  }
};
exports.startDiscovery = startDiscovery;
const stopDiscovery = async () => {
  try {
    const cancelled = await _reactNativeBluetoothClassic.default.cancelDiscovery();
    console.log(cancelled);
  } catch (error) {
    _reactNative.ToastAndroid.show(`Error occurred while attempting to cancel discover devices`, _reactNative.ToastAndroid.BOTTOM);
  }
};
exports.stopDiscovery = stopDiscovery;
const connectDevice = async deviceId => {
  try {
    const connected = await _reactNativeBluetoothClassic.default.connectToDevice(deviceId, {
      delimiter: "\r"
    });
    if (!connected) {
      throw new Error(`Failed to connect to device: ${deviceId}`);
    }
    console.log(`Connected to device: ${deviceId}`);
    return connected;
  } catch (error) {
    _reactNative.ToastAndroid.show(`Error connecting to device: ${deviceId}`, _reactNative.ToastAndroid.BOTTOM);
    return false;
  }
};
exports.connectDevice = connectDevice;
const disconnectDevice = async deviceId => {
  try {
    const disconnected = await _reactNativeBluetoothClassic.default.disconnectFromDevice(deviceId);
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
exports.disconnectDevice = disconnectDevice;
const pairDevice = async deviceId => {
  try {
    const paired = await _reactNativeBluetoothClassic.default.pairDevice(deviceId);
    if (!paired) {
      throw new Error(`Failed to pair with device: ${deviceId}`);
    }
    return paired;
  } catch (error) {
    console.error(`Error pairing with device: ${deviceId}`, error);
    throw error;
  }
};
exports.pairDevice = pairDevice;
const unPairDevice = async deviceId => {
  try {
    const unpaired = await _reactNativeBluetoothClassic.default.unpairDevice(deviceId);
    if (!unpaired) {
      throw new Error(`Failed to unpair with device: ${deviceId}`);
    }
    return unpaired;
  } catch (error) {
    console.error(`Error unpairing with device: ${deviceId}`, error);
    throw error;
  }
};
exports.unPairDevice = unPairDevice;
const getPairedDevices = async () => {
  try {
    const pairedDevices = await _reactNativeBluetoothClassic.default.getBondedDevices();
    return pairedDevices;
  } catch (err) {
    console.error("Error getting paired devices", err);
    return [];
  }
};
exports.getPairedDevices = getPairedDevices;
const getConnectedDevice = async () => {
  try {
    const connectedDevices = await _reactNativeBluetoothClassic.default.getConnectedDevices();
    return connectedDevices;
  } catch (err) {
    console.error("Error getting connected devices", err);
    return [];
  }
};
exports.getConnectedDevice = getConnectedDevice;
const getBondedDevices = async () => {
  try {
    const bondedDevices = await _reactNativeBluetoothClassic.default.getBondedDevices();
    return bondedDevices;
  } catch (error) {
    console.error("Error fetching bonded devices:", error);
    throw new Error("Failed to fetch bonded devices");
  }
};
exports.getBondedDevices = getBondedDevices;
const onBluetoothEnabled = callback => {
  const subscription = _reactNativeBluetoothClassic.default.onBluetoothEnabled(callback);
  return subscription;
};
exports.onBluetoothEnabled = onBluetoothEnabled;
const onBluetoothDisabled = callback => {
  const subscription = _reactNativeBluetoothClassic.default.onBluetoothDisabled(callback);
  return subscription;
};
exports.onBluetoothDisabled = onBluetoothDisabled;
const onStateChanged = callback => {
  const subscription = _reactNativeBluetoothClassic.default.onStateChanged(callback);
  return subscription;
};
exports.onStateChanged = onStateChanged;
const onDeviceConnected = callback => {
  const subscription = _reactNativeBluetoothClassic.default.onDeviceConnected(callback);
  return subscription;
};
exports.onDeviceConnected = onDeviceConnected;
const onDeviceDisconnected = callback => {
  const subscription = _reactNativeBluetoothClassic.default.onDeviceDisconnected(callback);
  return subscription;
};
exports.onDeviceDisconnected = onDeviceDisconnected;
const openBluetoothSettings = async () => {
  try {
    await _reactNativeBluetoothClassic.default.openBluetoothSettings();
    _reactNative.ToastAndroid.show("Bluetooth settings opened", _reactNative.ToastAndroid.SHORT);
  } catch (error) {
    console.error("Error opening Bluetooth settings:", error);
    throw new Error("Failed to open Bluetooth settings");
  }
};
exports.openBluetoothSettings = openBluetoothSettings;
const cleanupSubscriptions = subscriptions => {
  subscriptions.forEach(subscription => subscription.remove());
};
exports.cleanupSubscriptions = cleanupSubscriptions;
const read = async device => {
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
exports.read = read;
const write = async (device, data) => {
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
exports.write = write;
const available = async device => {
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
exports.available = available;
const clear = async device => {
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
exports.clear = clear;
//# sourceMappingURL=bluetooth.js.map