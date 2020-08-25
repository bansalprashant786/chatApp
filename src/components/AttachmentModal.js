import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
	Platform
} from 'react-native';
import { IconButton } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';

import DocumentPicker from 'react-native-document-picker';
import { grantCameraPermission } from '../helpers/cameraAccess';
import { grantReadWritePermission } from '../helpers/readAndWriteAccess';
import CommonModal from './Modal';
import ImageModal from './ImageModal';
import DocumentModal from './DocumentModal';

const dimensions = Dimensions.get('window');
const width = dimensions.width;
const height = dimensions.height;

const AttachmentModal = ({ closeModal, visible, currentUser, thread, setTransferred, setUploading}) => {

  const [imageSource, setImageSource] = useState({})
  const [imageModal, setImageModal] = useState(false)
	const [documentModal, setDocumentModal] = useState(false)
	const [documentSource, setDocumentSource] = useState({})
	function closeDocumentModal(){
		setDocumentModal(false)
	}

	function handlePicker(response){
		if (response.didCancel) {
			console.log('User cancelled image picker');
		} else if (response.error) {
			console.log('ImagePicker Error: ', response.error);
		} else if (response.customButton) {
			console.log('User tapped custom button: ', response.customButton);
			alert(response.customButton);
		} else {
			let source = response;
			setImageSource(source);
			setImageModal(true);
			closeModal(false)
		}
	}

  function handleCamera(type){
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
		};

		grantCameraPermission()
		.then(() => {
			ImagePicker.launchCamera(options, (response) => {
				handlePicker(response)
			});
		})
	}


	async function handleDocument() {
		grantReadWritePermission()
		.then(() => {
			closeModal(true);
			DocumentPicker.pick({
				type: [DocumentPicker.types.allFiles],
			})
			.then(res => {
				setDocumentModal(true);
				setDocumentSource(res)
			})
			.catch(err => {
				if (DocumentPicker.isCancel(err)) {
					// User cancelled the picker, exit any dialogs or menus and move on
				} else {
					throw err;
				}
			});
		});

	}


	function handleGallery(){
    // var options = {
    //   title: 'Select Image',
    //   customButtons: [
    //     { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
    //   ],
    //   storageOptions: {
    //     skipBackup: true,
    //     path: 'images',
    //   },
		// };

		const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
		};

		grantCameraPermission()
		.then(() => {
			ImagePicker.launchImageLibrary(options, (response) => {
				// Same code as in above section!
				handlePicker(response)
			});
		})


  }

	function closeImageModal(){
    setImageModal(false)
  }

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
								<View style={styles.modalItems}>
									<TouchableWithoutFeedback onPress={handleDocument}>
										<View style={styles.viewItem} >
											<IconButton  icon='file-document-outline' size={36} color='#6646ee' />
											<Text>Documents</Text>
										</View>
									</TouchableWithoutFeedback>
									<TouchableWithoutFeedback onPress={handleCamera}>
										<View style={styles.viewItem} >
											<IconButton  icon='camera-outline' size={36} color='#6646ee' />
											<Text>Camera</Text>
										</View>
									</TouchableWithoutFeedback>
									<TouchableWithoutFeedback onPress={handleGallery}>
										<View style={styles.viewItem} >
											<IconButton  icon='contacts' size={36} color='#6646ee' />
											<Text>Gallery</Text>
										</View>
									</TouchableWithoutFeedback>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
			</CommonModal>
			<ImageModal
				closeModal={closeImageModal}
				visible={imageModal}
				imageSource={imageSource}
				currentUser={currentUser}
				thread={thread}
				setTransferred={setTransferred}
				setUploading={setUploading}
			/>
			<DocumentModal
				closeModal={closeDocumentModal}
				visible={documentModal}
				currentUser={currentUser}
				thread={thread}
				documentSource={documentSource}
				setTransferred={setTransferred}
				setUploading={setUploading}
			/>

		</>
	)
}

export default AttachmentModal;

const styles = StyleSheet.create({

  innerModalViewHeightWidth: {
    backgroundColor: '#fff',
    width: width - 40,
    // height: 40
  },

  modalKeyboardClosedView:{
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    bottom: 30,
  },
  modalItems:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-evenly",
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 15,
  },
  viewItem: {
    padding: 20,
  }

});
