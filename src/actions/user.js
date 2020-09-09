import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

import { getFileName } from '../utils/utils'

export const login_success = 'login_success';
export const login_failed = 'login_failed';
export const set_data = 'set_data';

export const loginWithMobile = (phoneNumber) =>  dispatch => {
	return new Promise(async(resolve, reject) => {
		try {
			const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
			// setConfirm(confirmation);
			console.log('comes in login with mobile success');
			dispatch({
				type: login_success,
				payload: {confirmation, phoneNumber}
			})
			resolve(true);
		}catch (e) {
			console.log('error in login with mobile',e);
			dispatch({
				type: login_failed,
				payload: e
			})
			reject(e)
		}
	})

}


export const getCurrentUser = (userPhoneNumber, userKey) => dispatch => {
	console.log('getcurrentuser call', userKey);
	return new Promise(async(resolve, reject) => {
		let key = undefined
		if (userKey) {
			key = userKey
		} else {
			const snapshot = await database()
				.ref('PhoneNumber')
				.once('value')
			if (snapshot.val() !== null) {
				key = snapshot.val()[userPhoneNumber]
				if (key === undefined) return
			}
		}

		console.log('key in getcurrentUser',key);



		const userSnapshot = await database()
			.ref('Users')
			.child(key)
			.once('value')
		const _user = userSnapshot.val()
		if (_user) {
			dispatch({
				type: set_data,
				payload: {..._user, key: key}
			})
		}
		resolve();
	})
}

export const setUserData = (data) => dispatch => {
	dispatch({
		type: set_data,
		payload: data
	})
}


export const save = ({name, phoneNumber, avatarSource,avatarRef, fileName} ) => {
	console.log('comes in save function');
	return new Promise(async(resolve, reject) => {
		imageUpload(avatarSource, avatarRef, fileName)
		.then(async(imgData) => {
			const user = {
				name: name,
				phoneNumber: phoneNumber,
				avatarSource: imgData.avatarSource,
				avatarRef: imgData.avatarRef
			}

			const key = await database().ref('Users').push(user).key
			await database()
				.ref('PhoneNumber')
				.child(phoneNumber)
				.set(key)
				resolve(key);
		})
		})

}

export const update = ({name, phoneNumber, avatarSource,avatarRef, fileName, key} ) => {
	console.log('comes in update function');

	return new Promise(async(resolve, reject) => {
		imageUpload(avatarSource,avatarRef, fileName)
		.then(async(imgData) => {
			const user = {
				name: name,
				phoneNumber: phoneNumber,
				avatarSource: imgData.avatarSource,
				avatarRef: imgData.avatarRef
			}
			console.log('user in update', user);
			await database()
				.ref('Users')
				.child(key)
				.set(user)
				resolve(key)
		})

		})

}

export const imageUpload = async (avatarSource, avatarRef, fileName) => {
	let data = {
		avatarSource: avatarSource,
		avatarRef: avatarRef
	}
	return new Promise(async(resolve, reject) => {

		if (fileName) {
			// if (avatarRef) {
			// 	await storage()
			// 		.ref(avatarRef)
			// 		.delete()
			// }
			let uniqueFileName =getFileName(fileName);
			const task = await storage()
				.ref('/profilePics/' + uniqueFileName)
				.putFile(avatarSource);
			await	storage()
					.ref('/profilePics/' + uniqueFileName)
					.getDownloadURL()
					.then(url => {
						console.log('downloadurl', url);
						data = {
							avatarSource: url,
							avatarRef: task.metadata.fullPath
						}
					});
		}

		resolve(data);

	})
}
