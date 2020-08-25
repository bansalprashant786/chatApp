import { Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';

import { DIR_PATH } from '../components/downloadDoc';


/**
 * Grant read and write permission
 * @param {*} callback
 */
export function grantCameraPermission(callback) {
  return new Promise(async (resolve, reject) => {
		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.CAMERA,
			{
				title: "Chat App Camera Permission",
				message:"Chat App needs access to your camera",
				buttonNeutral: "Ask Me Later",
				buttonNegative: "Cancel",
				buttonPositive: "OK"
			}
		);
		if (callback) {
			callback(granted);
		}
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			resolve(true);
		} else {
			reject();
		}

		return;
	});
}
