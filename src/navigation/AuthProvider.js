
import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [confirm, setConfirm] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        loginWithMobile: async(phoneNumber) => {
          try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);
            console.log('comes in login with mobile success');
            return confirmation;
          }catch (e) {
            console.log('error in login with mobile',e);
          }
        },
        verify: async(code) => {
          try {
            await confirm.confirm(code);
          } catch (error) {
            console.log('Invalid code.');
          }
        },
        registerWithMobile: async(phoneNumber) => {
          try {
            await auth().signInWithPhoneNumber(phoneNumber);
          }catch (e) {
            console.log(e);
          }
        },
        register: async (email, password) => {
          try {
            await auth().createUserWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.error(e);
          }
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
