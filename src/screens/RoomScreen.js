import React, { useState, useContext, useEffect } from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  MessageText
} from 'react-native-gifted-chat';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  ImageBackground,
  Button,
  TouchableWithoutFeedback
} from 'react-native';
import { IconButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import CircularProgressBar from '../components/circularProgressBar';

import useStatsBar from '../utils/useStatusBar';
import { AuthContext } from '../navigation/AuthProvider';
import AttachmentModal from '../components/AttachmentModal';
import { handleSend } from '../helpers/firebaseSend';
import { getFileNameFromUrl, downloadFileWithPermission } from '../helpers/utils';
import ImageViewModal from '../components/ImageViewModal';

const dimensions = Dimensions.get('window');
const width = dimensions.width;
const height = dimensions.height;

export default function RoomScreen({ route }) {
  useStatsBar('light-content');

  const [messages, setMessages] = useState([]);
  const [attachmentModal, setAttachmentModal] = useState(false)
  const { thread } = route.params;
  const { user } = useContext(AuthContext);
  const currentUser = user.toJSON();
  const [uploading, setUploading] = useState({});
  const [transferred, setTransferred] = useState({});

  const [imageSrc, setImageSrc] = useState('');
  const [imageViewModal, setImageViewModal] = useState(false);
  const [imageDownloadProgress, setImageDownloadProgress] = useState(0);
  const [documentDownloadProgress, setDocumentDownloadProgress] = useState(0)
  function handleUpload(id, value){
    setUploading({
      ...uploading,
      [id]: value
    })
  }

  function handleTransferred(id, value){
    setTransferred({
      ...transferred,
      [id]: value
    })
  }

  function sendMessages(messages){
    console.log('messages in room screen', messages);
    handleSend(messages, thread, currentUser);
  }

  useEffect(() => {
    const messagesListener = firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        console.log(querySnapshot.docs);
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.email
            };
          }

          return data;
        });

        setMessages(messages);
      });

    // Stop listening for updates whenever the component unmounts
    return () => {
      messagesListener();
    }
  }, []);

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#6646ee'
          }
        }}
        textStyle={{
          right: {
            color: '#fff'
          }
        }}
      />
    );
  }


  function handleImageViewModal(src){
    setImageSrc(src);
    setImageViewModal(true);
  }

  function closeImageViewModal(){
    setImageViewModal(false);
  }

  function renderMessage(props) {
    const { currentMessage} = props
    if(currentMessage.text){
      return<MessageText {...props} currentMessage={{text: currentMessage.text} } />
    }

  }

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#6646ee' />
      </View>
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon='send-circle' size={32} color='#6646ee' />
        </View>
      </Send>
    );
  }

  function closeAttachmentModal(){
    setAttachmentModal(false)
  }

  function openAttachmentModal(){
    setAttachmentModal(true)
  }

  function renderActions(props){
    return (
      <View>
        <IconButton
          icon='attachment'
          size={25} color='#6646ee'
          onPress={openAttachmentModal}
        />
      </View>
    )
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon='chevron-double-down' size={36} color='#6646ee' />
      </View>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  function changeDocumentProgress(per){
    console.log('percentage in roomscreen', per);
    setDocumentDownloadProgress(per);
    console.log('percentage in roomscreen document', documentDownloadProgress);

  }

  function handleDownloadDocument(message){

    downloadFileWithPermission(message.document, 'documents', changeDocumentProgress);
  }

  function renderCustomView(props){
    if(props.currentMessage.document){
      return(
        <View>
          <Text>{getFileNameFromUrl(props.currentMessage.document)}</Text>
          {
            uploading[props.currentMessage.uploadId] || documentDownloadProgress?
              <View>
                <CircularProgressBar size={30} width={3} percentage={transferred[props.currentMessage.uploadId]|| documentDownloadProgress || 0} />
              </View>
              : null
          }
          <View>
            <IconButton
              icon='download'
              animated={true}
              size={30} color='#fff'

              onPress={() => handleDownloadDocument(props.currentMessage)}
            />
          </View>
        </View>
      )
    }
  }

  function changeProgress(per){
    console.log('percentage in roomscreen', per);
    setImageDownloadProgress(per);
  }

  function handleDownloadImage(message){

    downloadFileWithPermission(message.image, 'images', changeProgress);
  }

  function renderMessageImage(props){
    const { currentMessage } = props;
    return(
      <TouchableWithoutFeedback onPress={() => handleImageViewModal(currentMessage.image)}>
      <View
      // style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20}}
      >
        <ImageBackground
          source={{uri: currentMessage.image}}
          style={{
            width: 200,
            height: 200,
            borderRadius: 13,
            margin: 3,
            resizeMode: 'cover',
          }}
        >
        <View style={{ top: 0, right: 0, position: 'absolute', margin: 0}}>
        <IconButton
          icon='download'
          animated={true}
          size={30} color='#fff'

          onPress={() => handleDownloadImage(currentMessage)}
        />
        </View>

          {
            uploading[currentMessage.uploadId] || imageDownloadProgress ?
              <View
              style={
                {
                  flex:1,
                  justifyContent: 'flex-end',
                  marginTop: 8,
                }
              }
            >
              <CircularProgressBar size={30} width={3} percentage={transferred[currentMessage.uploadId]|| imageDownloadProgress || 0} />
            </View>
            : null
          }
        </ImageBackground>
      </View>
      </TouchableWithoutFeedback>
    )
  }

  return (
    <>

    <GiftedChat
      messages={messages}
      onSend={sendMessages}
      user={{ _id: currentUser.uid }}
      placeholder='Type your message here...'
      alwaysShowSend
      showUserAvatar
      scrollToBottom
      imageProps={{imageStyle: {   flex: 1,
            width:100,
            height:100,}}}
      renderBubble={renderBubble}
      renderLoading={renderLoading}
      renderSend={renderSend}
      renderCustomView={renderCustomView}
      scrollToBottomComponent={scrollToBottomComponent}
      renderSystemMessage={renderSystemMessage}
      renderActions={renderActions}
      renderMessageImage={renderMessageImage}
      // renderMessage={renderMessage}
      // onPressActionButton={()=> console.log('action button call')}
      // renderMessage={renderMessage}
    />

    <AttachmentModal
      currentUser={currentUser}
      thread={thread}
      closeModal={closeAttachmentModal}
      visible={attachmentModal}
      setTransferred={handleTransferred}
      setUploading={handleUpload}
    />
    <ImageViewModal
      imageSrc={imageSrc}
      visible={imageViewModal}
      closeModal={closeImageViewModal}
    />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  systemMessageWrapper: {
    backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold'
  },
  actionsContainer:{
    margin:5,

  },
  actionsWrapper:{
    color: 'red'
  },
});
