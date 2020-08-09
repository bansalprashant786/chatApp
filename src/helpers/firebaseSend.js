
import firestore from '@react-native-firebase/firestore';

export async function handleSend(messages, thread, currentUser) {
	const text = messages[0].text;
	const image = messages[0].image;
	const document = messages[0].document;
	
	firestore()
		.collection('THREADS')
		.doc(thread._id)
		.collection('MESSAGES')
		.add({
			text,
			createdAt: new Date().getTime(),
			user: {
				_id: currentUser.uid,
				email: currentUser.email
			},
			image,
		});

	await firestore()
		.collection('THREADS')
		.doc(thread._id)
		.set(
			{
				latestMessage: {
					text,
					createdAt: new Date().getTime()
				}
			},
			{ merge: true }
		);
}
