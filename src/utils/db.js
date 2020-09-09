import AsyncStorage from '@react-native-community/async-storage';

export function saveKey(key) {
  console.log('comes in save key', key)
  return AsyncStorage.setItem('USER_KEY', key)
}

export function loadKey(callback) {
  console.log('comes in load key');
  return AsyncStorage.getItem('USER_KEY', callback)
}
