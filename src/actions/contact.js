import database from '@react-native-firebase/database';

export const FETCH_CONTACTS = 'FETCH_CONTACTS'
export const START_CONVERSATION = 'START_CONVERSATION'

export const fetchContacts = (key) => dispatch => {
	return new Promise(async(resolve, reject) => {
    const snapshot = await database().ref('Users').once('value')
    let contacts = []
    snapshot.forEach(item => {
      if (key !== item.key) {
        const contact = {
          key: item.key,
          ...item.val()
        }
        contacts.push(contact)
      }
		})
		dispatch({
			type: FETCH_CONTACTS,
			payload: contacts
		})
		resolve(true);
	})
}

export const startConversation = (receiver, userKey) => {
	console.log('comes in start conversation ', receiver, userKey);
	return new Promise(async(resolve, reject) => {
		try {
      let key = null

      let Users = {}
      Users[userKey] = true
      Users[receiver] = true

      const snapshot = await database()
        .ref('Conversations')
        .orderByChild(userKey)
        .equalTo(true)
        .once('value')

      snapshot.forEach(item => {
        item.forEach(subItem => {
          if (subItem.key === receiver) {
            key = item.key
            return
          }
        })
      })

      if (key === null){
        key = await database().ref('Conversations').push(Users).key
			}

      return resolve(key)
    } catch (error) {
      return reject(error)
    }
  })
}
