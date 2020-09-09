import React from 'react'
import { View, Text, ImageBackground, Dimensions } from 'react-native'

import colors from '../theme/colors'
import HeaderIcon from './headerIcon'

const Header = props => {

  const handleOnPress = () => {
    console.log('headerIcon press call');
    props.nav.navigate('Profile')
  }

  return (
    <ImageBackground
      source={require('../img/header-bg.png')}
      style={{
        height: 100,
        position: props.absolute ? 'absolute' : 'relative',
        top: 0,
        zIndex: 99,
        width: Dimensions.get('window').width
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          {props.back ? (
            <HeaderIcon
              name={'arrow-back'}
              style={{ marginTop: 8 }}
              onPress={() => props.nav.goBack()}
            />
          ) : (
            <View />
          )}
          <Text
            style={{
              color: colors.white,
              fontSize: 20,
              margin: 8,
              marginLeft: props.back ? 8 : 16,
              marginBottom: 16,
              fontWeight: '500'
            }}
          >
            {props.title}
          </Text>
        </View>
        {props.rightIcon ? (
          <HeaderIcon
            name={props.rightIcon}
            style={{ marginRight: 16, zIndex: 1 }}
            onPress={()=> handleOnPress()}
          />
        ) : (
          <View />
        )}
      </View>
    </ImageBackground>
  )
}

export default Header;
