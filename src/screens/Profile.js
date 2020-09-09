import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet
} from 'react-native'
import ImagePicker from 'react-native-image-picker'
import {connect} from 'react-redux';
import {getCurrentUser, setUserData, save, update } from '../actions/user';

import ProgressiveImage from '../components/progressiveImage'
import style from '../theme/index'
import colors from '../theme/colors'
import { saveKey } from '../utils/db'

const Profile = ({ getCurrentUser, userInfo, setUserData, navigation}) => {
	const [isLoading, setIsLoading] = useState(true);
  const [isFromFile, setIsFromFile] = useState(false);

	useEffect(() => {
		getCurrentUser(userInfo.phoneNumber, userInfo.key).then(()=> setIsLoading(false));
		return () => {}
	}, [])

	const selectAvatar = () => {
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
        // console.log('User cancelled image picker')
      } else if (response.error) {
        // console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        // console.log('User tapped custom button: ', response.customButton)
      } else {
        setUserData({ avatarSource: response.path});
        setUserData({ fileName: response.fileName });
        setIsFromFile(true);
      }
    })
  }

  const onSaveOrUpdate = () => {
    setIsLoading(true);
    if (!userInfo.key) {
      save(userInfo)
      .then(key => {
        saveKey(key).then(() => {
          setIsLoading(false)
          navigation.replace('Conversation')
        })
      })

    } else {
      update(userInfo)
      .then(key => {
        saveKey(key).then(() => {
          setIsLoading(false)
          navigation.replace('Conversation')
        }).catch((err)=> console.log('err', err))

      })
    }
  }
  return (
    <View style={[style.container, _style.container]}>
      <TouchableOpacity
        style={[_style.avatar, { backgroundColor: '#fff', elevation: 15 }]}
        onPress={selectAvatar}
      >
        <ProgressiveImage
          style={[_style.avatar]}
          source={
            userInfo.avatarSource ? {
              uri:
                (isFromFile ? 'file:///' : '') +
                userInfo.avatarSource
            }
          : require('../img/profile.png')
          }
          thumbnail={require('../img/profile.png')}
        />
      </TouchableOpacity>
      <TextInput
        style={_style.textInput}
        underlineColorAndroid={'transparent'}
        placeholder={'Name'}
        onChangeText={text => (setUserData({name: text}))}
        value={userInfo.name}
      />
      {isLoading ? (
        <ActivityIndicator
          size={'large'}
          color={colors.primary}
          style={{ margin: 24 }}
        />
      ) : (
        <View
          style={{
            backgroundColor: colors.primary,
            alignSelf: 'center',
            padding: 8,
            paddingRight: 32,
            paddingLeft: 32,
            borderRadius: 6
          }}
        >
          <TouchableOpacity onPress={onSaveOrUpdate}>
            <Text style={[style.footerButtonText, { fontWeight: '500' }]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const _style = StyleSheet.create({
  container: {
    justifyContent: 'center'
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    alignSelf: 'center'
  },
  textInput: {
    backgroundColor: colors.white,
    margin: 32,
    padding: 8,
    borderColor: colors.border,
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 18,
    elevation: 6
  }
})

const mapStateToProps = state => ({
	userInfo: state.userInfo.data
});


export default connect(
  mapStateToProps,
  {getCurrentUser, setUserData},
)(Profile);
