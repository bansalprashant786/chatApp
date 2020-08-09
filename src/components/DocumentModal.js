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

import CommonModal from './Modal';
import { handleSend } from '../helpers/firebaseSend';

const dimensions = Dimensions.get('window');
const width = dimensions.width;
const height = dimensions.height;


const DocumentModal = ({ closeModal, visible, documentSource}) => {

	async function handleDocument(){
		const { uri, name } = documentSource;
		const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
		const data = await RNFS.readFile(uploadUri, 'base64')

		const task = storage()
		.ref(`documents/${name}`)
		.putString(data, 'base64');

		task.on('state_changed', snapshot => {},
		error => {
			console.log('error', error);
		},
		() => {
			storage()
				.ref(`documents/${name}`)
				.getDownloadURL()
				.then(url => {
					const message = [{
						document: url
					}];
					handleSend(message, thread, currentUser);
					closeModal(true);
				});
		});
		try {
			await task;
		} catch (e) {
			console.error(e);
		}
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
