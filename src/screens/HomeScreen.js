import React, { useState, useEffect } from 'react';
import { Image,View, StyleSheet, FlatList, TouchableOpacity, Text, Button, ScrollView, PermissionsAndroid } from 'react-native';
import { List, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { IconButton } from 'react-native-paper';
import Contacts from 'react-native-contacts';

import Loading from '../components/Loading';
// import useStatsBar from '../utils/useStatusBar';
import CustomImagePicker from '../components/ImagePicker';
import CircularProgressBar from '../components/circularProgressBar';
import FileViewer from 'react-native-file-viewer';
import { downloadFile} from '../components/downloadDoc';
import { grantReadWritePermission } from '../helpers/readAndWriteAccess';
import storage from '@react-native-firebase/storage';

export default function HomeScreen({ navigation }) {
  // useStatsBar('light-content');

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch threads from Firestore
   */

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

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('THREADS')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot && querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            // give defaults
            name: '',

            latestMessage: {
              text: '',
              image: '',
              document: ''
            },
            ...documentSnapshot.data()
          };
        });

        setThreads(threads);

        if (loading) {
          setLoading(false);
        }
      });

    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  function renderDescription(message){
    if(message.text){
      return (<Text>{message.text}</Text>);
    }
    else if(message.image){
      return (
        <View>
          <IconButton icon='google-photos' size={20} color='#6646ee' />
          <Text>Photo</Text>
        </View>
      )
    }
    else if(message.document){
      return(
        <View>
          <IconButton icon='google-photos' size={20} color='#6646ee' />
          <Text>document</Text>
        </View>
      )
    }


  }

  function fileOpen(){
    grantReadWritePermission()
    .then((response) => {
      console.log('response', response)
      downloadFile(
        true,
        'https://firebasestorage.googleapis.com/v0/b/chatapp-b45c9.appspot.com/o/documents%2FPrashant%20resume.pdf?alt=media&token=a16f5639-c83b-4343-98fa-7ae2a7d8f4c6',
        true,
        false,
        'documents'
      )
      .then(()=> console.log('file download success'));
    })

  }

  return (
    <ScrollView contentContainerStyle={{paddingBottom: 100}}>
      <View style={styles.container}>
        <CustomImagePicker />
        <FlatList
          data={threads}
          keyExtractor={item => item._id}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Room', { thread: item })}
            >
              <List.Item
                title={item.name}
                description={() => renderDescription(item.latestMessage)}
                titleNumberOfLines={1}
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                descriptionNumberOfLines={1}
              />
            </TouchableOpacity>
          )}
        />
        <Button title='testing' onPress={checkContact} />
        <Image
          source={{uri:'data:image/jpeg;base64,gs://chatapp-b45c9.appspot.com/documents/sample.pdf'}}
          // source={{uri: 'https://firebasestorage.googleapis.com/v0/b/chatapp-b45c9.appspot.com/o/documents%2Fsample.pdf?alt=media&token=9e697c39-23fa-4232-a3dd-c851fb287a95'}}
          style={{ width: 250, height: 250 }}
        />
        <Button title='testing' onPress={fileOpen} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  }
});
