import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import {connect} from 'react-redux';

import { getCurrentUser } from '../actions/user';

import AuthStack from './AuthStack';
import LoggedStack from './LoggedStack';
import Loading from '../components/Loading';
import { loadKey } from '../utils/db'

function Routes({ getCurrentUser }) {
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [isLogin, setIsLogin] = useState(false)
  // Handle user state changes
  function onAuthStateChanged(user) {
    // userLoginInfo(user);
    if (initializing) setInitializing(false);
    setLoading(false);
  }

  useEffect(() => {
    loadKey((err, result) => {
      if (result) {
        setIsLogin(true);
        getCurrentUser('',result).then(()=> setLoading(false))
      }
      else{
        setLoading(false);
      }
    })

    return ; // unsubscribe on unmount
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {isLogin ? <LoggedStack /> : <AuthStack />}
      {/* <AuthStack /> */}
    </NavigationContainer>
  );
}


const mapStateToProps = state => ({
  userInfo: state,
  loginInfo: state.userInfo.loginInfo
});

export default connect(
  mapStateToProps,
  {getCurrentUser},
)(Routes);
