import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {AuthMain} from '../screens/authScreens';
// import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

const Stack = createStackNavigator();
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
      initialRouteName="AuthMain">
      <Stack.Screen name="AuthMain" component={AuthMain} />
    </Stack.Navigator>
  );
};

export default AuthStack;
