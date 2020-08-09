import React, { useState, useContext, useEffect } from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import useStatsBar from '../utils/useStatusBar';
import { AuthContext } from '../navigation/AuthProvider';
import AttachmentModal from '../components/AttachmentModal';
import { handleSend } from '../helpers/firebaseSend';

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

  function sendMessages(messages){
    handleSend(messages, thread, currentUser);
  }

  useEffect(() => {
    const messagesListener = firestore()
      .collection('THREADS')
      .doc(thread._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
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

  // function renderMessage(props) {
  //   const {
  //     currentMessage: { text: currText },
  //   } = props

  //   let messageTextStyle

  //   // Make "pure emoji" messages much bigger than plain text.
  //   if (currText && emojiUtils.isPureEmojiString(currText)) {
  //     messageTextStyle = {
  //       fontSize: 28,
  //       // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
  //       lineHeight: Platform.OS === 'android' ? 34 : 30,
  //     }
  //   }

  //   return <SlackMessage {...props} messageTextStyle={messageTextStyle} />
  // }

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
      renderBubble={renderBubble}
      renderLoading={renderLoading}
      renderSend={renderSend}
      scrollToBottomComponent={scrollToBottomComponent}
      renderSystemMessage={renderSystemMessage}
      renderActions={renderActions}
      // onPressActionButton={()=> console.log('action button call')}
      // renderMessage={renderMessage}
    />

    <AttachmentModal currentUser={currentUser} thread={thread} closeModal={closeAttachmentModal} visible={attachmentModal} />

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
