import React, {useState, useEffect, useContext} from 'react';
import {View, Text, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import {SIZES, FONTS, COLORS, icons, images, lotties} from '../../../constants';
import {Header, IconButton} from '../../../components';

import AnimatedLottieView from 'lottie-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import * as Animatable from 'react-native-animatable';
import {modifySubjectData} from '../../../redux/reducers/UserReducer';
const Batch = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {netinfo, batchData} = useSelector(s => s.UserReducer);
  const [studentSubjects, setStudentSubjects] = useState([]);
  useEffect(() => {
    setStudentSubjects(batchData?.subjects);
  }, []);

  function renderHeader() {
    return (
      <Header
        title={batchData?.generation_name}
        containerStyle={{
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 25,
        }}
        leftComponent={
          <IconButton
            icon={icons.back}
            containerStyle={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{rotate: '180deg'}],

              borderWidth: 1,
              borderRadius: SIZES.radius,
              borderColor: COLORS.gray2,
            }}
            iconStyle={{
              width: 20,
              height: 20,
              tintColor: COLORS.gray2,
            }}
            onPress={() => navigation.goBack()}
          />
        }
        rightComponent={<View style={{width: 40}} />}
      />
    );
  }

  function renderBoday() {
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
      <View>
        <View
          style={{
            marginVertical: RFValue(10),
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('BatchTable');
            }}
            style={{
              backgroundColor: COLORS.lightGray3,
              // padding: SIZES.padding,
              padding: SIZES.base,
              borderRadius: SIZES.radius,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.29,
              shadowRadius: 4.65,

              elevation: 7,
            }}>
            <View
              style={{
                // width: RFValue(50),
                // height: RFValue(50),
                // backgroundColor: 'red',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AnimatedLottieView
                autoPlay
                loop
                source={lotties.schedule}
                style={{
                  width: RFValue(40),
                  height: RFValue(40),
                }}
                resizeMode="contain"
              />
            </View>

            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.dark,
              }}>
              الجدول الدراسى
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...FONTS.h2, color: COLORS.dark}}>المواد المسجلة</Text>

          <AnimatedLottieView
            source={lotties.placeholder_book}
            autoPlay
            loop={false}
            style={{
              width: RFValue(70),
              height: RFValue(70),
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
        </View>
        {studentSubjects.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            {studentSubjects?.map((item, index) => {
              return (
                <Animatable.View
                  key={index}
                  delay={index * 100}
                  animation="fadeInUp"
                  useNativeDriver
                  style={{
                    backgroundColor: COLORS.primary + '20',
                    padding: SIZES.base,
                    borderRadius: SIZES.base,
                    width: '48%',
                    minHeight: RFValue(120),
                    marginBottom: RFValue(15),
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(modifySubjectData(item));
                      navigation.navigate('Subject');
                    }}>
                    <Text
                      style={{
                        ...FONTS.h3,

                        color: COLORS.dark,
                      }}>
                      {item?.subject_name}
                    </Text>
                    <AnimatedLottieView
                      source={lotties.book_subject}
                      autoPlay
                      loop={false}
                      style={{
                        width: RFValue(70),
                        height: RFValue(70),
                        alignSelf: 'center',
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </Animatable.View>
              );
            })}
          </View>
        ) : (
          <>
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
          </>
        )}
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {renderHeader()}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          paddingBottom: SIZES.radius,
        }}
        showsVerticalScrollIndicator={false}>
        {renderBoday()}
      </ScrollView>
    </View>
  );
};

export default Batch;
