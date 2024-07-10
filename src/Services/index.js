import React from 'react';

// import messaging from '@react-native-firebase/messaging';

// const FcmToken = async () => await messaging().getToken();

import utils from '../utils';
async function getAccount() {
  return await utils.get('account');
}
async function setAccount(data) {
  return await utils.set('account', data);
}

async function getFirst() {
  return await utils.get('first');
}
async function setFirst(data) {
  return await utils.set('first', data);
}
async function logout() {
  return await utils.set('account', null);
}

export default {
  logout,
  setAccount,
  getAccount,
  getFirst,
  setFirst,
  //   FcmToken,
};
