import React from 'react';
import {
  View,
  StyleSheet,
	Text,
	Image,
  TouchableWithoutFeedback,
  Dimensions,
	Platform,
} from 'react-native';
import { IconButton } from 'react-native-paper';

import CommonModal from './Modal';


const dimensions = Dimensions.get('window');
const width = dimensions.width;
const height = dimensions.height;

const ImageViewModal = ({ closeModal, visible, imageSrc}) => {

	return(
		<>
			<CommonModal
				customProps={{visible: visible, transparent: false, animationType: 'slide', avoidKeyboard: true}}
				closeModal={closeModal}
			>
				<TouchableWithoutFeedback
					onPress={closeModal}
				>
					<View style={styles.container}>
						<Image
							source={{uri:imageSrc}}
							style={{width: 250, height: 250}}
						/>
					</View>
				</TouchableWithoutFeedback>
			</CommonModal>
		</>
	)
}

export default ImageViewModal;

const styles = StyleSheet.create({
	container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  fadingContainer: {
    paddingVertical: 8,
		paddingHorizontal: 16,
		// width: 250,
		// height: 250,
    backgroundColor: "powderblue"
  },
  fadingText: {
    fontSize: 28,
    textAlign: "center",
		margin: 10,
		color: 'red'
  },
  buttonRow: {
    flexDirection: "row",
    marginVertical: 16
  }
});
