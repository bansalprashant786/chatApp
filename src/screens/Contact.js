import React, {useEffect, useState } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'

import Contact from '../components/contact'
import style from '../theme/index'

import {connect} from 'react-redux';

import { fetchContacts, startConversation } from '../actions/contact';
import LoadView from '../components/LoadView';

const Contacts = ({ fetchContacts, contacts, navigation, userInfo }) => {
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		fetchContacts(userInfo.key).then(() => setIsLoading(false));
		return () => {}
	}, []);

	const handleChat = (item) => {
		console.log('comes in handlechat', item);
		startConversation(item.key, userInfo.key).then(key => {
			navigation.replace('Chat', {
				conversationKey: key,
				title: item.name
			})
		})
	}


  const listView = () => {
    return (
      <View>
        <FlatList
          data={contacts}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
            <Contact
              name={item.name}
              avatarUrl={{ uri: item.avatarSource }}
              onPress={() => handleChat(item) }
            />
          )}
        />
      </View>
    )
  }

	return (
		<View style={style.container}>
			{isLoading ? <LoadView /> : listView()}
		</View>
	)
}

const mapStateToProps = state => ({
	userInfo: state.userInfo.data,
	contacts: state.contacts.contacts
});

export default connect(
	mapStateToProps,
	{fetchContacts},
)(Contacts);
