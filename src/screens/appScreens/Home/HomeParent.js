import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import {FormInput, Header, TextIconButton} from '../../../components';
import {COLORS, FONTS, icons, images, lotties, SIZES} from '../../../constants';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import {SharedElement} from 'react-navigation-shared-element';
import * as Animatable from 'react-native-animatable';
import FastImage from 'react-native-fast-image';
import {setParentStudentData} from '../../../redux/reducers/ParentReducer';
const CARD_HEIGHT = 220;
const CARD_WIDTH = SIZES.width * 0.8;
const HomeParent = ({navigation}) => {
  const dispatch = useDispatch();
  const [loadingPage, setLoadingPage] = useState(true);
  const {netinfo} = useSelector(s => s.UserReducer);
  const {parentData} = useSelector(s => s.ParentReducer);

  function renderHeader() {
    return (
      <Header
        title={'ولى الأمر'}
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
        data={parentData}
        contentContainerStyle={{
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          paddingBottom: SIZES.padding * 2,
        }}
        horizontal
        pagingEnabled
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `studentsofparent-${index}`}
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        renderItem={({item, index}) => {
          return (
            <Animatable.View
              animation="fadeInUp"
              delay={index * 100}
              useNativeDriver
              style={{
                height: CARD_HEIGHT,
                width: CARD_WIDTH,
                backgroundColor: COLORS.white,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                marginHorizontal: 10,
                marginVertical: 10,
                elevation: 5,
                padding: SIZES.padding,
                borderRadius: RFValue(15),
              }}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setParentStudentData(item));
                  navigation.navigate('ParentStudentProfile', {
                    psData: item,
                  });
                }}
                style={{
                  width: '100%',
                  height: '100%',
                }}>
                <SharedElement
                  id={`item.${item?.student_id}.img`}
                  style={{
                    width: RFValue(60),
                    height: RFValue(60),
                    alignSelf: 'center',
                  }}>
                  <FastImage
                    source={images.main_logo}
                    style={{
                      width: RFValue(60),
                      height: RFValue(60),
                      alignSelf: 'center',
                    }}
                    resizeMode="contain"
                  />
                </SharedElement>

                <Text
                  style={{
                    ...FONTS.h2,
                    color: COLORS.black,
                  }}>
                  الإسم:
                </Text>
                <SharedElement id={`item.${item?.student_id}.text`}>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.gray,
                    }}>
                    {item?.student_name}
                  </Text>
                </SharedElement>
              </TouchableOpacity>
            </Animatable.View>
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
      <View
        style={{
          paddingHorizontal: SIZES.padding,
          // paddingBottom: SIZES.padding * 2,
        }}>
        <Text
          style={{
            ...FONTS.h2,
            color: COLORS.black,
          }}>
          الأبناء
        </Text>
      </View>

      {renderBody()}
    </View>
  );
};

export default HomeParent;
