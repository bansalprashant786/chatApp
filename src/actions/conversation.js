import database from '@react-native-firebase/database';

export const fetch_conversation = 'fetch_conversation';

const loadUserData = (item, userKey) => {
	console.log('itemkey in loaduserData', item, userKey);
	return new Promise(async resolve => {
		const lastMsg = await database()
			.ref('Messages')
			.child(item.key)
			.child(item.child('lastMsg').val())
			.once('value')

		item.forEach(async subItem => {
			console.log('subItem in item', subItem.key);
			if (subItem.val() === true && subItem.key !== userKey) {
				console.log('comes in if condition');
				const user = await database()
					.ref('Users')
					.child(subItem.key)
					.once('value')
					console.log('users in user', user);
				const data = {
					key: item.key,
					lastTime: item.val().lastTime,
					lastMessage: lastMsg.val() ? lastMsg.val().text : '',
					...user.val()
				}
				console.log(data);
				resolve(data)
			}
		})
	})
}

export const fetchConversations = (key) => dispatch => {
	console.log('key in fetchConversation', key);
	return new Promise(async(resolve, reject) => {
		database()
		.ref('Conversations')
		.orderByChild(key)
		.equalTo(true)
		.on('value', snapshot => {
			let conversations = []
			let promises = []
			console.log('snapshot in fetch conversation', snapshot);
			snapshot.forEach(item => {
				console.log('item in fetchConversation', item);
				promises.push(loadUserData(item, key))
				console.log('kjkjef');
			})

			console.log('promises', promises);

			Promise.all(promises).then(data => {
				console.log('comes in promise all');
				data.forEach(item => conversations.push(item))
				console.log('conversations in fetchConversation', conversations);
				conversations.sort((a, b) => {
					return b.lastTime - a.lastTime
				})

				dispatch({
					type: fetch_conversation,
					payload: conversations
				})
				resolve(true);
			})
		})
	})
}
