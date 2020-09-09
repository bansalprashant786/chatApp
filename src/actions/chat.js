import database from '@react-native-firebase/database';

export const sendMessage = async (key, text, userKey) => {
	const message = {
		sender: userKey,
		text: text,
		timeStamp: Math.floor(Date.now())
	}

	const messageKey = await database()
		.ref('Messages')
		.child(key)
		.push(message).key

	await database()
		.ref('Conversations')
		.child(key)
		.child('lastMsg')
		.set(messageKey)

	await database()
		.ref('Conversations')
		.child(key)
		.child('lastTime')
		.set(message.timeStamp)
}

export const onMessages = (key, callback) => {
	let messages = []

	database()
	.ref('Messages')
	.child(key)
	.on('child_added', snapshot => {
		const message = {
			key: snapshot.key,
			...snapshot.val()
		}

		messages.push(message)

		callback(messages)
	})
}
