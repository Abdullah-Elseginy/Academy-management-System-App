/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import store from './src/redux';
import notifee, {EventType} from '@notifee/react-native';

notifee.onBackgroundEvent(async ({type, detail}) => {
  console.log('type', EventType[type], detail);
  if (type === EventType.PRESS) {
    await notifee.cancelNotification(detail.notification?.id);
  } else if (type === EventType.DISMISSED) {
    await notifee.cancelNotification(detail.notification?.id);
  }
});

const MainApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => MainApp);
