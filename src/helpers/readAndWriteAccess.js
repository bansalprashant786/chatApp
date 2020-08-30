import { Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';

import { DIR_PATH } from '../components/downloadDoc';


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
        RNFS.mkdir(`${RNFS.ExternalStorageDirectoryPath}${DIR_PATH}/documents`)
          .then(res => {
            RNFS.mkdir(`${RNFS.ExternalStorageDirectoryPath}${DIR_PATH}/images`).then(
              res => {
                resolve(true);
              }
            )
            return;
          })
          .catch(err => {
            reject();
            return;
          });
      }
      else {
        reject();
        return;
      }
    } else if (Platform.OS === 'ios') {
      RNFS.mkdir(`${RNFS.DocumentDirectoryPath}${DIR_PATH}`, {
        NSURLIsExcludedFromBackupKey: true,
      })
        .then(res => {
          resolve(true);
          return;
        })
        .catch(() => {
          reject();
          return;
        });
    }
    // resolve(true);
    return;
  });
}
