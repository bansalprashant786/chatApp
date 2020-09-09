import React from 'react';
import Routes from './Routes';
import {Provider} from 'react-redux';
import store from '../store';
import { View, StatusBar, Text } from 'react-native'

import colors from '../theme/colors'
import '../utils/enableFontPatch'


export default function Providers() {
  return (
    // <PaperProvider>
      <Provider store={store}>
      <View style={{ flex: 1 }}>
          <StatusBar
            barStyle={'light-content'}
            backgroundColor={colors.primary}
          />
          <Routes />
        </View>
      </Provider>
    // </PaperProvider>
  );
}
