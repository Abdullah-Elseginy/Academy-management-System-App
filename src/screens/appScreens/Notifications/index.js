import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import {FormInput, Header, TextIconButton} from '../../../components';
import {COLORS, FONTS, icons, images, lotties, SIZES} from '../../../constants';
import {RFValue} from 'react-native-responsive-fontsize';

import MyLoader from '../../HomeLoader';
import {useSelector} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import NotificationItem from './NotificationItem';
import {POST} from '../../../Helpers/ApiHelper';

const Notifications = ({navigation}) => {
  const [loadingPage, setLoadingPage] = useState(true);
  const {netinfo, userData} = useSelector(s => s.UserReducer);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    getNotifications();
    // setTimeout(() => {
    // let data = [
    //   {
    // notification_id: 1,
    // notification_title: 'كلية الحاسبات والمعلومات',
    // notification_body: 'برجاء تسليم الاوراق المطلوبة غدا أخر موعد',
    // notification_date: '2023-03-20 14:15:30',
    //   },
    //   {
    //     notification_id: 2,
    //     notification_title: 'كلية الحاسبات والمعلومات',
    //     notification_body: 'غدا بدء الحجز فى التربية العسكرية',
    //     notification_date: '2023-03-21 09:20:10',
    //   },
    //   {
    //     notification_id: 3,
    //     notification_title: 'كلية الحاسبات والمعلومات',
    //     notification_body:
    //       'سوف يتم إعلان جدول الميدتيرم فى تمام الساعة العاشرة غدا',
    //     notification_date: '2023-03-22 16:40:13',
    //   },
    // ];
    //   setNotifications(data);
    //   setLoadingPage(false);
    // }, 2000);
  }, [netinfo]);

  async function getNotifications() {
    let data_to_send = {
      student_id: userData?.student_id,
    };
    let res = await POST('select_notification.php', data_to_send);
    if (res && Array.isArray(res)) {
      setNotifications(res);
    }
    setLoadingPage(false);
  }

  function renderHeader() {
    return (
      <Header
        title={'الإشعارات'}
        containerStyle={{
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 25,
        }}
        twoRight={true}
      />
    );
  }

  function renderBody() {
    if (loadingPage) {
      return (
        <View style={{flex: 1}}>
          <FlatList
            // numColumns={2}
            keyExtractor={item => `wcp22#-${item}`}
            data={['0', '1', '2', '3', '4', '5', '6', '7']}
            renderItem={() => <MyLoader />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    }

    if (!netinfo) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <AnimatedLottieView
            source={lotties.nonetwork}
            autoPlay
            loop
            style={{height: RFValue(180), width: '100%'}}
            resizeMode="contain"
          />
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.black,
            }}>
            برجاء التأكد من اتصال الانترنت
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={notifications}
        contentContainerStyle={{
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          paddingBottom: SIZES.padding * 2,
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `batch-${index}`}
        renderItem={({item, index}) => {
          return (
            <NotificationItem
              index={index}
              item={item}
              onPress={pressItem => {
                // alert(pressItem);
              }}
            />
          );
        }}
        ListEmptyComponent={() => {
          if (!loadingPage) {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AnimatedLottieView
                  source={lotties.emptyData}
                  autoPlay
                  loop
                  style={{height: RFValue(180), width: '100%'}}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: COLORS.black,
                    ...FONTS.h2,
                  }}>
                  لا توجد بيانات لعرضها
                </Text>
              </View>
            );
          }
        }}
      />
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
    </View>
  );
};

export default Notifications;
