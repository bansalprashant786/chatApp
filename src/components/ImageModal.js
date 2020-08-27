import React, {useState} from 'react';
import {
  Image,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
	Dimensions,
	Alert,
	Platform
} from 'react-native';
import { IconButton } from 'react-native-paper';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs'
import firestore from '@react-native-firebase/firestore';

import CommonModal from './Modal';
import Loading from './Loading';
import { handleSend } from '../helpers/firebaseSend';
import {getRandomString} from '../helpers/utils';
import { generateUniqueFileName } from '../helpers/randomFileName';

const dimensions = Dimensions.get('window');
const width = dimensions.width;
const height = dimensions.height;

const ImageModal = ({ closeModal, visible, imageSource, currentUser, thread, setTransferred, setUploading }) => {
	const [documentId, setDocumentId] = useState('');
	async function uploadImage(){
		const { uri, fileName } = imageSource;
		const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
		const uploadId = getRandomString(20);
		const message = [{
			text: '',
			image: uri,
			uploadId: uploadId
		}];
		let documentId = await handleSend(message, thread, currentUser);
		closeModal(true);
		console.log('after send message', documentId);
		const extension = fileName.split('.')[1];
		const uniqueFileName = generateUniqueFileName('Image', extension);
		setUploading(uploadId, true);
		const data = await RNFS.readFile(uploadUri, 'base64')
		storage()
		.setMaxUploadRetryTime(5000);
		const task = storage()
		.ref(`Images/${uniqueFileName}`)
		.putString(data, 'base64');
		console.log('before upload loop');
		task.on('state_changed', snapshot => {
			setTransferred(uploadId, Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100)
		},
		error => {
			console.log('error', error);
		},
		() => {
			console.log('upload loop', uniqueFileName);
			storage()
				.ref(`Images/${uniqueFileName}`)
				.getDownloadURL()
				.then(url => {
					console.log('url', url);
					firestore()
					.collection('THREADS')
					.doc(thread._id)
					.collection('MESSAGES')
					.doc(documentId)
					.update('image', url)
					.then(()=> console.log('image update after uploading')).catch((err) => console.log(err));
				});
		});
		try {
			await task;
		} catch (e) {
			console.error(e);
		}
		setUploading(uploadId, false);
	};

	function messageSend(){
		uploadImage();
	}



	return(
		<>
			<CommonModal
				customProps={{visible: visible, animationIn: 'rotate', avoidKeyboard: true, transparent: false}}
				closeModal={closeModal}
			>
				<TouchableWithoutFeedback
					onPress={closeModal}
				>
					<View style={[styles.imageModalOuterView]}>
						<TouchableWithoutFeedback >
							<View style={styles.imageModalViewHeightWidth}>
								<View style={styles.modalItems}>
									{
										imageSource.uri ?
											<View>
												<Image
													source={{uri: imageSource.uri}}
													style={{ width: 250, height: 250 }}
												/>
												<IconButton onPress={messageSend} icon='send-circle' size={32} color='#6646ee' />
											</View>
											: <Loading />
									}
								</View>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
			</CommonModal>
		</>
	);
}

export default ImageModal;

const styles = StyleSheet.create({

  modalItems:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-evenly",
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 15,
  },
  imageModalViewHeightWidth:{
    backgroundColor: '#fff',
    width: width
  },
  imageModalOuterView: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    width: width,
    height: height
  }

});
