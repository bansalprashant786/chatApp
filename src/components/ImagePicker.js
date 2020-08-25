
/*This is an example of Image Picker in React Native*/
import React from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';

export default class CustomImagePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: {},
    };
  }
  chooseFile = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source,
        });
      }
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>

          {/* {
						this.state.filePath.data ?
							<Image
								source={{
									uri: 'data:image/jpeg;base64,' + this.state.filePath.data,
								}}
								style={{ width: 100, height: 100 }}
							/>
							: null
					} */}
          {
						this.state.filePath.uri ?
							<Image
								source={this.state.filePath}
								style={{ width: 250, height: 250 }}
							/>
							: null
					}
          <Text style={{ alignItems: 'center' }}>
            {this.state.filePath.uri}
          </Text>
          <Button title="Choose File" onPress={this.chooseFile} />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
