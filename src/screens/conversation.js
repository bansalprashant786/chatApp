import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
	TouchableOpacity,
	Text,
	Button,
	PermissionsAndroid
} from 'react-native';
import Contacts from 'react-native-contacts';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';

import { fetchConversations } from '../actions/conversation';

import Conversation from '../components/conversation';
import style from '../theme/index';
import colors from '../theme/colors';
import LoadView from '../components/LoadView';

const Conversations = ({ fetchConversations, navigation, conversations, userInfo, state  }) => {
	const [isLoading, setIsLoading] = useState(true)
	useEffect(() => {
		fetchConversations(userInfo.key).then(()=> setIsLoading(false));
		return () => {}
	}, []);

	console.log('userInfo in conversation', userInfo, state);

	const checkContact = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        'title': 'Contacts',
        'message': 'This app would like to view your contacts.',
        'buttonPositive': 'Please accept bare mortal'
      }
    ).then(() => {
      Contacts.getAll((err, contacts) => {
        if (err === 'denied'){
          // error
        } else {
          // contacts returned in Array
          console.log('contacts data', contacts);
        }
      })
    })
  }

	const handlePress = (item) => {
		navigation.navigate('Chat', {
			conversationKey: item.key,
			imageURL: item.avatarSource,
			title: item.name
		});
	}

	const listView = () => {
		return (
			<View>
				<FlatList
					data={conversations}
					keyExtractor={(item, index) => `${index}`}
					renderItem={({ item }) => (
						<Conversation
							name={item.name}
							avatarUrl={{ uri: item.avatarSource }}
							onPress={() => handlePress(item)}
							lastMessage={item.lastMessage}
						/>
					)}
				/>
				<Button title='testing' onPress={checkContact} />

			</View>
		)
	}

	return (
		<View style={style.container}>
			{isLoading ? <LoadView/> : listView()}
			<TouchableOpacity
				style={style.addButton}
				onPress={() => navigation.navigate('Contact')}
			>
				<Icon size={24} name={'message'} color={colors.white} />
			</TouchableOpacity>
		</View>
	)
}

const mapStateToProps = state => ({
	userInfo: state.userInfo.data,
	conversations: state.conversation.conversations,
	state: state
});

export default connect(
	mapStateToProps,
	{fetchConversations},
)(Conversations);
