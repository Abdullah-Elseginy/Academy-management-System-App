import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {COLORS, FONTS, icons, images, lotties, SIZES} from '../../../constants';
import {RFValue} from 'react-native-responsive-fontsize';
import {Header, IconButton} from '../../../components';
import AnimatedLottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import {POST} from '../../../Helpers/ApiHelper';
import MyLoader from '../../HomeLoader';
import * as Animatable from 'react-native-animatable';
import {useIsFocused} from '@react-navigation/native';
const Tasks = ({navigation}) => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const {netinfo, userData, subjectData} = useSelector(s => s.UserReducer);

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused]);
  async function getData() {
    setLoadingPage(true);
    let data_to_send = {
      student_id: userData?.student_id,
      subject_id: subjectData?.subject_id,
    };

    let res = await POST('select_exam.php', data_to_send);
    if (res && Array.isArray(res.exams)) {
      setData(res.exams);
    }
    setLoadingPage(false);
  }

  function renderHeader() {
    return (
      <Header
        title={'تاسكات'}
        containerStyle={{
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 25,
        }}
        titleStyle={{
          ...FONTS.h2,
        }}
        leftComponent={
          <IconButton
            icon={icons.back}
            containerStyle={{
              width: 40,
              transform: [{rotate: '180deg'}],
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderRadius: SIZES.radius,
              borderColor: COLORS.black,
            }}
            iconStyle={{
              width: 20,
              height: 20,
              tintColor: COLORS.black,
            }}
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
        rightComponent={<View style={{width: 40}} />}
      />
    );
  }

  function renderBody() {
    if (loadingPage) {
      return (
        <View style={{flex: 1}}>
          <FlatList
            // numColumns={2}
            keyExtractor={item => `wcp21#-${item}`}
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
        data={data}
        contentContainerStyle={{
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          paddingBottom: SIZES.padding * 2,
        }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item, index}) => (
          <Animatable.View
            delay={index * 50}
            useNativeDriver
            animation={'fadeInRight'}
            style={{
              backgroundColor: COLORS.lightGray2,
              marginTop: SIZES.radius,
              paddingHorizontal: SIZES.radius,
              borderRadius: 5,
              padding: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              minHeight: RFValue(50),
              borderLeftColor: COLORS.primary,
              borderLeftWidth: 6,
            }}>
            <TouchableOpacity
              style={
                {
                  // flexDirection: 'row',
                  // alignItems: 'center',
                  // justifyContent: 'center',
                }
              }
              onPress={() => {
                navigation.navigate('Task', {
                  psData: item,
                });
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.black,
                    }}>
                    {item.exam_name}
                  </Text>
                </View>
                <AnimatedLottieView
                  autoPlay
                  loop
                  source={lotties.completing_tasks}
                  style={{
                    width: RFValue(30),
                    height: RFValue(30),
                  }}
                  resizeMode="contain"
                />
              </View>

              {item?.exam_time > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.black,
                    }}>
                    مدة التاسك
                  </Text>
                  <Text
                    style={{
                      ...FONTS.h5,
                      color: COLORS.black,
                    }}>
                    {item?.exam_time} د
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </Animatable.View>
        )}
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
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      {renderHeader()}
      {renderBody()}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  headerText: {
    ...FONTS.h2,
    color: COLORS.black,
  },
  notice: {
    flex: 1,
    // backgroundColor: 'red',
    paddingBottom: 25,
  },
  LoadingScreen: {
    flex: 1,

    position: 'absolute',
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
  },
});

export default Tasks;
