import { Platform, PermissionsAndroid } from 'react-native';

/**
 * Grant read and write permission
 * @param {*} callback
 */
export function grantReadWritePermission(callback) {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      if (callback) {
        callback(granted);
      }
      if (
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
				console.log('permisiion granted');
				resolve(true);
			}
			else{
				reject(true)
			}
    }

    return;
  });
}
