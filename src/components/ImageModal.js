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

import CommonModal from './Modal';
import Loading from './Loading';
import { handleSend } from '../helpers/firebaseSend';

const dimensions = Dimensions.get('window');
const width = dimensions.width;
const height = dimensions.height;

const ImageModal = ({ closeModal, visible, imageSource, currentUser, thread }) => {

	async function uploadImage(){
		const { uri, fileName } = imageSource;
		const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
		const message = [{
			text: '',
			image: uri
		}];
		await handleSend(message, thread, currentUser);
		closeModal(true);
		const data = await RNFS.readFile(uploadUri, 'base64')


		const task = storage()
		.ref(`Images/${fileName}`)
		.putString(data, 'base64');

		task.on('state_changed', snapshot => {},
		error => {
			console.log('error', error);
		},
		() => {
			storage()
				.ref(`Images/${fileName}`)
				.getDownloadURL()
				.then(url => {

				});
		});
		try {
			await task;
		} catch (e) {
			console.error(e);
		}
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
