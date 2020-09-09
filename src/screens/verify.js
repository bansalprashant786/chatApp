import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  BackHandler
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import {connect} from 'react-redux';

import style from '../theme/index'

const Verify = ({ navigation, confirmation}) =>  {
	console.log('confirmation in verify', confirmation);
	const [verificationCode, setVerificationCode] = useState('123456')
	const screenWidth = Dimensions.get('window').width;
	const animatedRef = useRef(null);
	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', handleBackPress)
		return () => {
			BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
		}
	}, []);

  const handleBackPress = () => {
    animatedRef.flipOutX(400).then(() => {
      navigation.replace('Register')
    })
    return true
	}

	const verificationUser = async () => {
    const isVerify = await confirmation.confirm(verificationCode)
    if (isVerify) {
      navigation.replace('Profile')
    }
  }

	return (
		<View style={style.container}>
			<Image
				source={require('../img/register-bg.png')}
				style={{
					width: screenWidth,
					position: 'absolute',
					bottom: 0
				}}
			/>
			<Animatable.View
				ref={animatedRef}
				style={style.content}
				animation={'flipInX'}
			>
				<Text style={style.verifyText}>Verify your number</Text>
				<Text style={style.smsText}>Enter verification code</Text>
				<TextInput
					placeholder={'Verification Code'}
					keyboardType={'numeric'}
					style={style.textInput}
					underlineColorAndroid={'transparent'}
					onChangeText={text => setVerificationCode(text)}
					value={verificationCode}
				/>
				<Text style={style.signinText}>
					By signing up, You agree to the{' '}
					{<Text style={style.termsText}>Terms &amp; Conditions</Text>}
				</Text>
				<View style={{ flexDirection: 'row', alignSelf: 'center' }}>
					<TouchableOpacity style={style.nextButton} onPress={verificationUser}>
						<Text style={style.footerButtonText}>Verify</Text>
					</TouchableOpacity>
				</View>
			</Animatable.View>
		</View>
	)
}

const mapStateToProps = state => ({
	userInfo: state,
	confirmation: state.userInfo.data.confirmation
});

export default connect(
  mapStateToProps,
  {},
)(Verify);
