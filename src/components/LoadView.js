import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import style from '../theme/index';
import colors from '../theme/colors'

const LoadView = () => {
	return (
		<View style={style.load}>
			<ActivityIndicator
				size={'large'}
				color={colors.primary}
				style={{ margin: 24 }}
			/>
		</View>
	)
};

export default LoadView;
