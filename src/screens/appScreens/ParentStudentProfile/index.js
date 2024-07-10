import React, {useState, useEffect, useContext} from 'react';
import {Header, IconButton} from '../../../components';
import {SharedElement} from 'react-navigation-shared-element';
import AnimatedLottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import * as Animatable from 'react-native-animatable';
import * as ProgressItem from 'react-native-progress';
import {POST} from '../../../Helpers/ApiHelper';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import {COLORS, FONTS, icons, images, lotties, SIZES} from '../../../constants';
import MyLoader from '../../HomeLoader';
const ParentStudentProfile = ({navigation, route}) => {
  const {parent_student} = useSelector(s => s.ParentReducer);
  const [loadingPage, setLoadingPage] = useState(true);
  const {netinfo} = useSelector(s => s.UserReducer);
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [successRate, setSuccessRate] = useState(0);
  const [failRate, setFailRate] = useState(0);
  const [accomRate, setAccomRate] = useState(0);

  const {psData} = route.params;
  useEffect(() => {
    getStudentSub();
    // getData();
  }, [netinfo]);

  async function getStudentSub() {
    let data_to_send = {
      student_id: parent_student?.student_id,
    };

    let res = await POST('select_sub_generation.php', data_to_send);
    if (res && Array.isArray(res)) {
      let finalArr = [];
      for (let item of res) {
        finalArr = [...item.subjects, ...finalArr];
      }
      setStudentSubjects(finalArr);
    }
    getData();
  }
  async function getData() {
    let data_to_send = {
      student_id: parent_student?.student_id,
      subject_id: '0',
    };

    let res = await POST('select_solved.php', data_to_send);
    if (res && Array.isArray(res)) {
      let totalScore = res.reduce(function (acc, item) {
        let deg = parseInt(item?.solved_exam_score?.split('/')[1]);
        return acc + deg;
      }, 0);
      let fullStaudent = res.reduce(function (acc, item) {
        let deg = parseInt(item?.solved_exam_score?.split('/')[0]);
        return acc + deg;
      }, 0);

      let successNum = res.reduce(function (acc, item) {
        let student = parseInt(item?.solved_exam_score?.split('/')[0]);
        let full = parseInt(item?.solved_exam_score?.split('/')[1]);
        let halfDeg = full / 2;
        let addNum = student >= halfDeg ? 1 : 0;

        return acc + addNum;
      }, 0);

      let failNum = res?.length - successNum;

      setSuccessRate(res?.length > 0 ? successNum / res?.length : 0);
      setFailRate(res?.length > 0 ? failNum / res?.length : 0);
      setAccomRate(totalScore > 0 ? fullStaudent / totalScore : 0);
    }

    setLoadingPage(false);
  }

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 25,
        }}>
        {/* Left */}
        <View style={{}}>
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
        </View>
        {/* Title */}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <SharedElement id={`item.${psData?.student_id}.text`}>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: SIZES.h3,
                color: COLORS.black,
              }}>
              {psData?.student_name}
              {/* {parent_student?.student_name} */}
            </Text>
          </SharedElement>
        </View>
        {/* Right */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <View style={{width: 40}} />
        </View>
      </View>
    );
  }

  function renderBoday() {
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
      <View>
        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.black,
          }}>
          الإحصائيات العامة
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            // backgroundColor: 'red',
            // width: '100%',
            flexWrap: 'wrap',
          }}>
          <View style={styles.cardContaiber}>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.black,
              }}>
              نسبة النجاح
            </Text>
            <ProgressItem.Circle
              progress={successRate}
              size={RFValue(55)}
              color={COLORS.primary}
              unfilledColor={COLORS.gray}
              borderWidth={0}
              showsText
              textStyle={{fontSize: 16}}
              animated={false}
            />
          </View>
          <View style={styles.cardContaiber}>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.black,
              }}>
              التراكمى
            </Text>
            <ProgressItem.Circle
              progress={accomRate}
              size={RFValue(55)}
              color={COLORS.support4}
              unfilledColor={COLORS.gray}
              borderWidth={0}
              showsText
              textStyle={{fontSize: 16}}
              animated={false}
            />
          </View>
          <View style={styles.cardContaiber}>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.black,
              }}>
              نسبة الرسوب
            </Text>
            <ProgressItem.Circle
              progress={failRate}
              size={RFValue(55)}
              color={COLORS.red}
              unfilledColor={COLORS.gray}
              borderWidth={0}
              showsText
              textStyle={{fontSize: 16}}
              animated={false}
            />
          </View>
        </View>
        {/*  */}

        <Text
          style={{
            ...FONTS.h3,
            color: COLORS.black,
          }}>
          المواد
        </Text>

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
                      navigation.navigate('ParentShowSub', {
                        psData: item,
                      });
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
            {!loadingPage && (
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

ParentStudentProfile.sharedElements = route => {
  const {psData} = route.params;
  return [
    {
      id: `item.${psData?.student_id}.text`,
      animation: 'fade',
      resize: 'stretch',
    },
  ];
};
const styles = StyleSheet.create({
  cardContaiber: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.padding,
    alignItems: 'center',
    width: '48%',
    marginBottom: RFValue(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
export default ParentStudentProfile;
