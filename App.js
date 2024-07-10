import React, {useState, useEffect} from 'react';
import {View, Platform, StatusBar} from 'react-native';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {
  modifyIsFirst,
  modifyNetInfo,
  modifyUserLogin,
  modifyUserType,
  setUser,
} from './src/redux/reducers/UserReducer';
import {PermissionsAndroid} from 'react-native';
import Auth from './src/Services';
import SplashScreen from './SplashScreen';
import NetInfo from '@react-native-community/netinfo';
import {COLORS} from './src/constants';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {AppStack, AuthStack} from './src/navigation';
import Onboarding from './src/screens/Onboarding';
// import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {MenuProvider} from 'react-native-popup-menu';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';

const Stack = createStackNavigator();
import 'moment/locale/ar';
import {setParentData} from './src/redux/reducers/ParentReducer';
import {setProf} from './src/redux/reducers/ProfReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ObBoardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
      initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={Onboarding} />
    </Stack.Navigator>
  );
};
const App = () => {
  const dispatch = useDispatch();

  const {login, first} = useSelector(state => state.UserReducer);
  const [loginChk, setloginChk] = useState(true);

  React.useEffect(() => {
    return notifee.onForegroundEvent(async ({type, detail}) => {
      if (type === EventType.PRESS) {
        // if (detail.notification.data) {
        //   navigation.navigate('Chat', {receiverData: detail.notification.data});
        // }
        await notifee.cancelNotification(detail.notification.id);
      } else if (type === EventType.DISMISSED) {
        await notifee.cancelNotification(detail.notification.id);
      }
    });
  }, []);

  useEffect(() => {
    (async function () {
      if (await requestUserPermission()) {
        getFcmToken();
      } else {
        console.log('Not Authorization status:', await requestUserPermission());
      }
    })();
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    receiveNotificationFromQuitState();
    receiveBackgroundNotification();
    getUser();
    NetInfo.addEventListener(state => {
      dispatch(modifyNetInfo(true));

      // dispatch(modifyNetInfo(state.isInternetReachable));
    });
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      let isInchat = await AsyncStorage.getItem('isInChat');

      if (isInchat != 'yes') {
        DisplayNotification(remoteMessage);
      }

      // }
    });

    return unsubscribe;
  }, []);

  const requestUserPermission = async () => {
    //On ios,checking permission before sending and receiving messages
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  };

  const getFcmToken = async () => {
    let checkToken = await AsyncStorage.getItem('fcmToken');
    console.log('the old token', checkToken);
    if (!checkToken) {
      try {
        const fcmToken = await messaging().getToken();
        if (!!fcmToken) {
          console.log('fcme token generated', fcmToken);
          await AsyncStorage.setItem('fcmToken', fcmToken);
        }
      } catch (error) {
        console.log('error in fcmToken', error);
        // alert(error?.message);
      }
    }
  };

  const receiveNotificationFromQuitState = () => {
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          // navigation.navigate('Profile');
          // if (detail.notification.data) {
          //   navigation.navigate('Chat', {
          //     receiverData: detail.notification.data,
          //   });
          // }
        }
      });
  };
  const receiveBackgroundNotification = () => {
    messaging().onNotificationOpenedApp(async remoteMessage => {
      if (remoteMessage) {
        // if (detail.notification.data) {
        //   navigation.navigate('Chat', {receiverData: detail.notification.data});
        // }
      }
    });
  };

  async function DisplayNotification(remoteMessage) {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      data: remoteMessage.data,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  const getUser = async () => {
    let data = await Auth.getAccount();
    let isFirst = await Auth.getFirst();

    if (isFirst != '1') {
      dispatch(modifyIsFirst(true));
    }
    if (data != null) {
      if (data?.type == '1') {
        dispatch(setUser(data));
      } else if (data?.type == '2') {
        dispatch(setParentData(data.data));
        dispatch(modifyUserLogin(true));
        dispatch(modifyUserType('2'));
      } else {
        dispatch(setProf(data.data));
        dispatch(modifyUserLogin(true));
        dispatch(modifyUserType('3'));
      }
    }

    setTimeout(() => {
      setloginChk(false);
    }, 2300);
  };

  if (loginChk) {
    return <SplashScreen />;
  }
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={COLORS.primary} />
      <MenuProvider>
        <NavigationContainer>
          {first ? <ObBoardStack /> : login ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
        <Toast />
      </MenuProvider>
    </SafeAreaView>
  );
};

export default App;
