
import firestore from '@react-native-firebase/firestore';

export async function handleSend(messages, thread, currentUser) {
	console.log('meesgae in handle send', messages);
	const text = messages[0].text;
	const image = messages[0].image;
	const document = messages[0].document;
	const uploadId = messages[0].uploadId;
	const time = new Date().getTime();
	let documentId = '';
	await firestore()
		.collection('THREADS')
		.doc(thread._id)
		.collection('MESSAGES')
		.add({
			text,
			createdAt: time,
			user: {
				_id: currentUser.uid,
				email: currentUser.email
			},
			image,
			document,
			uploadId
		}).then((res)=> {
			console.log('rehdc',res._documentPath._parts[3])
			documentId = res._documentPath._parts[3];
		}).catch((err) => console.log('fewdw', err));

	console.log('perform first function');

	await firestore()
		.collection('THREADS')
		.doc(thread._id)
		.set(
			{
				latestMessage: {
					text,
					image,
					document,
					uploadId,
					createdAt: time
				}
			},
			{ merge: true }
		);
	return documentId;
}
