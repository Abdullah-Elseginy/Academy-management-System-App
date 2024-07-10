import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  SectionList,
  ToastAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {COLORS, FONTS, SIZES, icons, images} from '../../../constants';
import {useSelector} from 'react-redux';
import {Header, IconButton, MsgComponent} from '../../../components';
import FastImage from 'react-native-fast-image';
import {RFValue} from 'react-native-responsive-fontsize';
import {ActivityIndicator} from 'react-native-paper';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {POST} from '../../../Helpers/ApiHelper';

const Chat = ({navigation}) => {
  const {subjectData, userData, userType} = useSelector(s => s.UserReducer);
  const {profData, profSub} = useSelector(s => s.ProfReducer);

  const [msg, setMsg] = useState('');
  const [disabled, setdisabled] = useState(false);
  const [allChat, setallChat] = useState([]);
  const msgValid = txt => txt && txt.replace(/\s/g, '').length;
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    endableNoti();

    return async () => await AsyncStorage.setItem('isInChat', 'no');
  }, []);
  async function endableNoti() {
    await AsyncStorage.setItem('isInChat', 'yes');
  }
  useEffect(() => {
    const onChildAdd = database()
      .ref(
        '/messages/' +
          (userType == '1' ? subjectData.room_id : profSub.room_id),
      )
      .on('child_added', snapshot => {
        setallChat(state => [snapshot.val(), ...state]);
      });
    setLoadingPage(false);

    return () =>
      database()
        .ref(
          '/messages/' +
            (userType == '1' ? subjectData.room_id : profSub.room_id),
        )
        .off('child_added', onChildAdd);
  }, [userType == '1' ? subjectData.room_id : profSub.room_id]);

  const sorted = () => {
    return allChat.sort(function (a, b) {
      return new Date(b.message_date) < new Date(a.message_date)
        ? -1
        : new Date(b.message_date) > new Date(a.message_date)
        ? 1
        : 0;
    });
  };

  function sendMsg() {
    if (msg == '' || msgValid(msg) == 0) {
      ToastAndroid.showWithGravityAndOffset(
        'Enter Something ....',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      return;
    }
    setdisabled(true);
    let msgData = {
      subject_id: userType == '1' ? subjectData.subject_id : profSub.subject_id,
      message: msg.trim(),
      student_id: userType == '1' ? userData?.student_id : profData?.doctor_id,
      message_date: moment().locale('en').format(),
      msgType: 'text',
      student_name:
        userType == '1' ? userData?.student_name : profData?.doctor_name,
    };

    const newRefrance = database()
      .ref(
        '/messages/' +
          (userType == '1' ? subjectData?.room_id : profSub?.room_id),
      )
      .push();
    msgData.id = newRefrance.key;
    newRefrance.set(msgData).then(() => {
      POST('send_chat_notification.php', {
        subject_id:
          userType == '1' ? subjectData.subject_id : profSub.subject_id,
        subject_name:
          userType == '1' ? subjectData.subject_name : profSub.subject_name,
        student_name:
          userType == '1' ? userData?.student_name : profData?.doctor_name,
        message: msg.trim(),
        student_id:
          userType == '1' ? userData?.student_id : profData?.doctor_id,
        userType,
      });
      setMsg('');
      setdisabled(false);
    });
    // socket.emit('sendMessage', {subId: subjectData?.subject_id, msg: msgData});
  }
  function renderHeader() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={1}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Ionicons
            style={{
              marginHorizontal: 10,
              color: COLORS.white,
            }}
            size={30}
            name="chevron-forward"
          />
          <FastImage
            source={images.main_logo}
            style={{
              width: RFValue(35),
              height: RFValue(35),
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={{flex: 1, marginLeft: 10}}>
          <Text
            numberOfLines={1}
            style={{
              color: COLORS.white,
              ...FONTS.h3,
              textTransform: 'capitalize',
            }}>
            {userType == '1' ? subjectData.subject_name : profSub.subject_name}
          </Text>
        </View>
      </View>
    );
  }

  function renderBody() {
    return (
      <ImageBackground
        style={{
          flex: 1,
        }}
        source={images.flowers}>
        <FlatList
          style={{flex: 1}}
          data={sorted()}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          inverted
          renderItem={({item, index}) => {
            return (
              <MsgComponent
                sender={
                  item?.student_id ==
                  (userType == '1' ? userData.student_id : profData?.doctor_id)
                }
                item={item}
                index={index}
              />
            );
          }}
          ListEmptyComponent={
            loadingPage && <ActivityIndicator size={30} color={COLORS.white} />
          }
        />
      </ImageBackground>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {renderHeader()}
      {renderBody()}
      <View
        style={{
          backgroundColor: COLORS.darkOverlayColor2,
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 7,
          justifyContent: 'space-evenly',
        }}>
        <TextInput
          style={{
            backgroundColor: COLORS.white,
            width: '80%',
            borderRadius: 25,
            borderWidth: 0.5,
            borderColor: COLORS.white,
            paddingHorizontal: 15,
            color: COLORS.black,
            ...FONTS.h3,
          }}
          placeholder="type a message"
          placeholderTextColor={COLORS.black}
          multiline={true}
          value={msg}
          onChangeText={val => setMsg(val)}
        />

        <TouchableOpacity
          disabled={disabled}
          onPress={() => {
            sendMsg();
          }}>
          <Ionicons
            style={{
              // marginHorizontal: 15,
              color: COLORS.white,
            }}
            name="paper-plane-sharp"
            size={35}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container: {
    height: 50,
    backgroundColor: COLORS.primary,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default Chat;
