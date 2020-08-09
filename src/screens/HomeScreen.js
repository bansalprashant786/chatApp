import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Button, ScrollView, PermissionsAndroid } from 'react-native';
import { List, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { IconButton } from 'react-native-paper';

import Loading from '../components/Loading';
import useStatsBar from '../utils/useStatusBar';
import CustomImagePicker from '../components/ImagePicker';

export default function HomeScreen({ navigation }) {
  useStatsBar('light-content');

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch threads from Firestore
   */

  const requestCameraPermission = async () => {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
				{
					title: "Cool Photo App Camera Permission",
					message:
						"Cool Photo App needs access to your camera " +
						"so you can take awesome pictures.",
					buttonNeutral: "Ask Me Later",
					buttonNegative: "Cancel",
					buttonPositive: "OK"
				}
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log("You can use the camera");
			} else {
				console.log("Camera permission denied");
			}
		} catch (err) {
			console.warn(err);
		}
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('THREADS')
      .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const threads = querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            // give defaults
            name: '',

            latestMessage: {
              text: ''
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
      console.log('document', message.document);
      return(
        <View>
          <IconButton icon='google-photos' size={20} color='#6646ee' />
          <Text>document</Text>
        </View>
      )
    }


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
        <Button title='testing' onPress={requestCameraPermission} />
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
