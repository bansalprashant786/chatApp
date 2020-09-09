import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Conversation from '../screens/conversation';
import Contact from '../screens/Contact';
import Chat from '../screens/Chat';
import Header from '../components/header';
import ChatHeader from '../components/chatHeader';
import Profile from '../screens/Profile';

const Stack = createStackNavigator();

export default function LoggedStack() {
  return (
    <Stack.Navigator initialRouteName='Conversation' headerMode='screen'>
      <Stack.Screen
        name='Profile'
        component={Profile}
        options={({ navigation }) => ({
          header: ()=> null
        })}
      />
			<Stack.Screen
        name='Conversation'
        component={Conversation}
        options={({ navigation }) => ({
          header: ()=>{
            return(
              <Header
              nav={navigation}
              title={'Conversations'}
              rightIcon={'person'}
              // absolute
            />
            )
          }
        })}
        // { headerTitle: props => <LogoTitle {...props} /> }
      />
      <Stack.Screen
        name='Contact'
        component={Contact}
        options={({ navigation }) => ({
          header:() => (
            <Header
              nav={navigation}
              title={'Contacts'}
              back
              // absolute
            />
          )
        })}
      />
      <Stack.Screen
        name='Chat'
        component={Chat}
        options={({ navigation, route }) => {
        return {
          header:() => (
            <ChatHeader
              nav={navigation}
              uri={route.params.imageURL}
              title={route.params.title}
            />
          )
        }}}
      />
    </Stack.Navigator>
  );
}
