import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import style from '../theme/component/msgbar'
import colors from '../theme/colors'
import { sendMessage } from '../actions/chat';

const MsgBar = ({ conversationKey, userKey, _style }) => {
  const [text, setText] = useState('');
  const onSend = () => {
    if (text.trim() === '') return
    sendMessage(conversationKey, text.trim(), userKey)
    setText('');
  }

  return (
    <View style={[style.container, _style]}>
      <TextInput
        style={style.textInput}
        underlineColorAndroid={'transparent'}
        onChangeText={text => setText(text)}
        value={text}
        placeholder={'Type here..'}
      />
      <TouchableOpacity style={style.sendIcon} onPress={onSend}>
        <Icon name={'send'} color={colors.white} size={20} />
      </TouchableOpacity>
    </View>
  )
}

export default MsgBar;
