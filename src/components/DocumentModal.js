import React from 'react';

import {
  View,
  StyleSheet,
	Text,
	Button,
  TouchableWithoutFeedback,
  Dimensions,
	Platform
} from 'react-native';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs'
import firestore from '@react-native-firebase/firestore';

import CommonModal from './Modal';
import { handleSend } from '../helpers/firebaseSend';
import {getRandomString} from '../helpers/utils';
import { generateUniqueFileName } from '../helpers/randomFileName';

const dimensions = Dimensions.get('window');
const width = dimensions.width;
const height = dimensions.height;


const DocumentModal = ({ closeModal, visible, documentSource, thread, currentUser, setTransferred, setUploading }) => {

	async function handleDocument(){
		const { uri, name } = documentSource;
		const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
		const uploadId = getRandomString(20);

		const message = [{
			document: uri,
			uploadId: uploadId
		}];
		console.log('message', message);
		let documentId = await handleSend(message, thread, currentUser);
		closeModal(true);
		setUploading(uploadId, true);
		console.log('comes in first part');
		const data = await RNFS.readFile(uploadUri, 'base64')
		const uniqueFileName = generateUniqueFileName('Document')
		console.log('comes in second part', uniqueFileName);

		const task = storage()
		.ref(`documents/${uniqueFileName}`)
		.putString(data, 'base64');
		console.log('comes in third part');
		task.on('state_changed', snapshot => {
			setTransferred(uploadId, Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100)
		},
		error => {
			console.log('error', error);
		},
		() => {
			console.log('comes in fourth part');
			storage()
				.ref(`documents/${uniqueFileName}`)
				.getDownloadURL()
				.then(url => {
					firestore()
					.collection('THREADS')
					.doc(thread._id)
					.collection('MESSAGES')
					.doc(documentId)
					.update('document', url)
					.then(()=> console.log('document update after uploading')).catch((err) => console.log(err));
				});
		});
		try {
			await task;
		} catch (e) {
			console.error(e);
		}
		setUploading(uploadId, false);
	};

	return(
		<>
			<CommonModal
				customProps={{visible: visible, animationIn: 'rotate', avoidKeyboard: true}}
				closeModal={closeModal}
			>
				<TouchableWithoutFeedback
					onPress={closeModal}
				>
					<View style={[styles.modalKeyboardClosedView]}>
						<TouchableWithoutFeedback >
							<View style={styles.innerModalViewHeightWidth}>
								<View ><Text style={styles.textItem}>Send file</Text></View>
								<View style={styles.modalItems}>
									<View style={styles.viewItem}>
										<View style={styles.buttonItem} ><Button title='Cancel' onPress={closeModal} /></View>
										<View style={styles.buttonItem}><Button title='Send' onPress={handleDocument} /></View>
									</View>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
			</CommonModal>
		</>
	)
};

export default DocumentModal;

const styles = StyleSheet.create({

  innerModalViewHeightWidth: {
    backgroundColor: '#fff',
    width: width - 100,
    // height: 40
  },

  modalKeyboardClosedView:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalItems:{
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: "center",
		alignItems: 'flex-end',
		// paddingRight: 20
  },
  viewItem: {
		display: 'flex',
		flexDirection:'row',
		paddingRight:10,
	},
	buttonItem:{
		padding: 10,
	},
	textItem:{
		fontSize: 20,
		paddingLeft: 40,
		paddingTop: 20
	}

});
