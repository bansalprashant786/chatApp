import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import Register from '../screens/registerWithMobile';
import Verify from '../screens/verify';
import Profile from '../screens/Profile';
import Conversation from '../screens/conversation';
import Contact from '../screens/Contact';
import Chat from '../screens/Chat';
import Header from '../components/header';
import ChatHeader from '../components/chatHeader';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName='Register' headerMode='screen'>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Signup' component={SignupScreen} />
      <Stack.Screen
        name='Register'
        component={Register}
        options={({ navigation }) => ({
          header: ()=> null
        })}
      />
      <Stack.Screen
        name='Verify'
        component={Verify}
        options={({ navigation }) => ({
          header: ()=> null
        })}
      />
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
              absolute
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
