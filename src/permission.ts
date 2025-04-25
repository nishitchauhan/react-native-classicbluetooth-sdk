import { PermissionsAndroid } from "react-native";
import Geolocation from "react-native-geolocation-service";

const ALL_PERMISSIONS = [
  PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
  PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
];

/**
 * Requests all permissions defined in the `ALL_PERMISSIONS` array using `PermissionsAndroid.requestMultiple`.
 *
 * @async
 * @function
 * @returns {Promise<boolean>} A promise that resolves to `true` if all permissions are granted,
 *                             or `false` if any permission is denied or an error occurs.
 *
 * @throws Will log an error message to the console if an exception occurs during the permission request process.
 *
 * @description
 * This function checks if all required permissions are granted. If any permission is denied,
 * it logs a warning with the list of permissions that were not granted. If all permissions are granted,
 * it logs a success message to the console.
 *
 * @example
 * const permissionsGranted = await requestAllPermissions();
 * if (permissionsGranted) {
 *     console.log('All permissions are granted.');
 * } else {
 *     console.warn('Some permissions are not granted.');
 * }
 */
export const requestAllPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple(ALL_PERMISSIONS);
    const allGranted = ALL_PERMISSIONS.every(
      (permission) => granted[permission] === PermissionsAndroid.RESULTS.GRANTED
    );

    if (!allGranted) {
      const notGranted = ALL_PERMISSIONS.filter(
        (permission) =>
          granted[permission] !== PermissionsAndroid.RESULTS.GRANTED
      );
      const alertMessage = notGranted
        .map((permission: any) => permission + " is not granted.")
        .join("\n");
      console.warn(alertMessage);
      return false;
    }

    console.log("ALL GRANTED", allGranted);
    return allGranted;
  } catch (error) {
    console.error("Error requesting permissions", error);
    return false;
  }
};

/**
 * Checks if all required permissions are granted.
 *
 * This function iterates through a list of permissions (`ALL_PERMISSIONS`) and checks
 * if each permission is granted using `PermissionsAndroid.check`. If any permission
 * is not granted, it logs a warning with the list of permissions that are not granted.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if all permissions are granted,
 *                             or `false` if any permission is not granted or an error occurs.
 *
 * @throws This function does not throw errors directly but logs them to the console
 *         if an error occurs during the permission check process.
 */
export const checkAllPermissions = async () => {
  try {
    const results = await Promise.all(
      ALL_PERMISSIONS.map((permission) => PermissionsAndroid.check(permission))
    );
    const allGranted: boolean = results.every(
      (isGranted: boolean) => isGranted
    );
    if (!allGranted) {
      const notGranted = ALL_PERMISSIONS.filter(({}, index) => !results[index]);
      const alertMessage = notGranted
        .map((permission) => `${permission} is not granted.`)
        .join("\n");
      console.warn(alertMessage);
      return false;
    }
    return allGranted;
  } catch (error) {
    console.error("Error checking permissions", error);
    return false;
  }
};

/**
 * Requests the device's location service to retrieve the current position.
 *
 * This function uses `react-native-geolocation-service` to attempt to get the current location.
 * If the location is successfully retrieved, it resolves the promise with `true`.
 * If there is an error (e.g., location services are disabled), it resolves the promise with `false`
 * and logs the error message to the console.
 *
 * @async
 * @function
 * @returns {Promise<boolean>} A promise that resolves to `true` if the location is successfully retrieved,
 *                             or `false` if an error occurs.
 *
 * @example
 * const locationEnabled = await requestLocationService();
 * if (locationEnabled) {
 *     console.log('Location service is enabled and position retrieved.');
 * } else {
 *     console.warn('Failed to retrieve location. Ensure location services are enabled.');
 * }
 */
export const requestLocationService = async () => {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      () => {
        resolve(true);
      },
      (error) => {
        resolve(false);
        console.error(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};
