import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
const ALL_PERMISSIONS = [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN, PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT, PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
export const requestAllPermissions = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple(ALL_PERMISSIONS);
    const allGranted = ALL_PERMISSIONS.every(permission => granted[permission] === PermissionsAndroid.RESULTS.GRANTED);
    if (!allGranted) {
      const notGranted = ALL_PERMISSIONS.filter(permission => granted[permission] !== PermissionsAndroid.RESULTS.GRANTED);
      const alertMessage = notGranted.map(permission => permission + ' is not granted.').join('\n');
      console.warn(alertMessage);
      return false;
    }
    console.log('ALL GRANTED', allGranted);
    return allGranted;
  } catch (error) {
    console.error('Error requesting permissions', error);
    return false;
  }
};
export const checkAllPermissions = async () => {
  try {
    const results = await Promise.all(ALL_PERMISSIONS.map(permission => PermissionsAndroid.check(permission)));
    const allGranted = results.every(isGranted => isGranted);
    if (!allGranted) {
      const notGranted = ALL_PERMISSIONS.filter(({}, index) => !results[index]);
      const alertMessage = notGranted.map(permission => `${permission} is not granted.`).join('\n');
      console.warn(alertMessage);
      return false;
    }
    return allGranted;
  } catch (error) {
    console.error('Error checking permissions', error);
    return false;
  }
};
export const requestLocationService = async () => {
  return new Promise(resolve => {
    Geolocation.getCurrentPosition(() => {
      resolve(true);
    }, error => {
      resolve(false);
      console.error(error.message);
    }, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000
    });
  });
};
//# sourceMappingURL=permission.js.map