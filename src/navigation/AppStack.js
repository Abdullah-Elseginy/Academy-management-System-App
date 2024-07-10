import React from 'react';
import {TransitionPresets} from '@react-navigation/stack';
import BottomTab from './BottomTab';
import {
  Batch,
  BatchTable,
  Chat,
  Inquiry,
  LiveLecture,
  ParentShowSub,
  ParentStudentProfile,
  ProfInquiry,
  ProfSubVideos,
  ProfSummary,
  ProfTaskQuestions,
  ProfTasks,
  Subject,
  SubjectProf,
  SubVideos,
  Summarys,
  Task,
  Tasks,
} from '../screens/appScreens';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {useSelector} from 'react-redux';
import BottomTabParent from './BottomTabParent';
import BottomTabProf from './BottomTabProf';
const Stack = createSharedElementStackNavigator();
const AppStack = () => {
  const {userType} = useSelector(s => s.UserReducer);
  return (
    <Stack.Navigator
      screenOptions={{
        // gestureDirection: 'horizontal',
        // ...TransitionPresets.SlideFromRightIOS,
        headerShown: false,
      }}
      initialRouteName="MainStack">
      {userType == '1' ? (
        <Stack.Screen name="MainStack" component={BottomTab} />
      ) : userType == '2' ? (
        <Stack.Screen name="MainStack" component={BottomTabParent} />
      ) : (
        <Stack.Screen name="MainStack" component={BottomTabProf} />
      )}

      <Stack.Screen
        name="Batch"
        component={Batch}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="BatchTable"
        component={BatchTable}
        options={{
          gestureDirection: 'vertical',
          ...TransitionPresets.ModalPresentationIOS,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="Subject"
        component={Subject}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="SubjectProf"
        component={SubjectProf}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="Summarys"
        component={Summarys}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="SubVideos"
        component={SubVideos}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <Stack.Screen
        name="Inquiry"
        component={Inquiry}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <Stack.Screen
        name="ProfInquiry"
        component={ProfInquiry}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <Stack.Screen
        name="Tasks"
        component={Tasks}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="Task"
        component={Task}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="LiveLecture"
        component={LiveLecture}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      {/* Parents */}
      <Stack.Screen
        name="ParentStudentProfile"
        component={ParentStudentProfile}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="ParentShowSub"
        component={ParentShowSub}
        options={{
          gestureDirection: 'vertical',
          ...TransitionPresets.ModalPresentationIOS,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="ProfSubVideos"
        component={ProfSubVideos}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <Stack.Screen
        name="ProfTasks"
        component={ProfTasks}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="ProfTaskQuestions"
        component={ProfTaskQuestions}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen
        name="ProfSummary"
        component={ProfSummary}
        options={{
          gestureDirection: 'horizontal',
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
