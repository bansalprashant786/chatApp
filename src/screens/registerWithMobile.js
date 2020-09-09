import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native'
import {connect} from 'react-redux';

import PhoneInput from 'react-native-phone-input'
import * as Animatable from 'react-native-animatable'
import { loginWithMobile} from '../actions/user';
import style from '../theme/index'
import colors from '../theme/colors';

const mapStateToProps = state => ({
	userInfo: state
});


const Register = ({navigation, loginWithMobile, userInfo}) =>  {
	const screenWidth = Dimensions.get('window').width
	const [countryCode, setCountryCode] = useState('+91');
	const [phoneNumber, setPhoneNumber] = useState('');
	const animatedRef = useRef(()=>{});
	const phoneInputRef = useRef(()=>{});
	console.log('userInfo', userInfo);
	useEffect(() => {
		setCountryCode(phoneInputRef.current.getCountryCode())
		return () => {
		}
	}, [])

  const sendOTP = () => {
		animatedRef.current.flipOutX(400)
		.then(() => {
			const _phoneNumber = '+' + countryCode + phoneNumber;
			console.log('comes in sendOtp function');
			loginWithMobile(_phoneNumber)
			.then(() => navigation.replace('Verify'))
			.catch(er=> console.log('error in login', er))
    })
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
				<Text style={style.smsText}>{"You'll get a code via SMS"}</Text>
				<PhoneInput
					ref={phoneInputRef}
					style={{
						backgroundColor: colors.white,
						marginTop: 32,
						padding: 8,
						borderColor: colors.border,
						borderWidth: 0.5,
						elevation: 8
					}}
					initialCountry={'in'}
					textStyle={{ fontSize: 18, color: colors.text }}
					flagStyle={{ height: 32, width: 42 }}
					onChangePhoneNumber={phoneNumber =>
						setPhoneNumber(phoneNumber)
					}
					textProps={{
						value: phoneNumber
					}}
					onSelectCountry={() =>
						setCountryCode(phoneInputRef.current.getCountryCode())
					}
				/>
				<Text style={style.signinText}>
					By signin up, You agree to the{' '}
					{<Text style={style.termsText}>Terms &amp; Conditions</Text>}
				</Text>
				<TouchableOpacity
					style={style.nextButton}
					onPress={sendOTP}
				>
					<Text style={style.footerButtonText}>Send OTP</Text>
				</TouchableOpacity>
			</Animatable.View>
		</View>
	)
}

export default connect(
  mapStateToProps,
  {loginWithMobile},
)(Register);
