import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {COLORS, SIZES, FONTS, lotties} from '../../../constants';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import AnimatedLottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import * as Animatable from 'react-native-animatable';
import * as ProgressItem from 'react-native-progress';
import {POST} from '../../../Helpers/ApiHelper';
import {ActivityIndicator} from 'react-native-paper';
const ParentShowSub = ({navigation, route}) => {
  const {psData} = route.params;
  const {netinfo} = useSelector(s => s.UserReducer);
  const {parent_student} = useSelector(s => s.ParentReducer);
  const [loadingPage, setLoadingPage] = useState(true);
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [successRate, setSuccessRate] = useState(0);
  const [failRate, setFailRate] = useState(0);
  const [accomRate, setAccomRate] = useState(0);
  useEffect(() => {
    getSubResult();
    // getData();
  }, [netinfo]);

  async function getSubResult() {
    let data_to_send = {
      student_id: parent_student?.student_id,
      subject_id: psData?.subject_id,
    };

    let res = await POST('select_solved.php', data_to_send);
    if (res && Array.isArray(res)) {
      setStudentSubjects(res);
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
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 25,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FontAwesome name="angle-double-down" size={30} color={COLORS.dark} />
      </View>
    );
  }

  function renderBody() {
    if (loadingPage) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={RFValue(50)} color={COLORS.primary} />
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
            paddingHorizontal: SIZES.padding,
          }}>
          إحصائيات المادة
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            // backgroundColor: 'red',
            // width: '100%',
            paddingHorizontal: SIZES.padding,

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
        <FlatList
          data={studentSubjects}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            marginTop: SIZES.radius,
            //   paddingHorizontal: SIZES.padding,
            paddingBottom: SIZES.radius,
          }}
          renderItem={({item, index}) => (
            <Animatable.View
              animation={'fadeInRight'}
              useNativeDriver
              delay={index * 100}
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                backgroundColor: COLORS.white,
                borderRadius: SIZES.base,
                marginVertical: RFValue(4),
                width: '90%',
                flexDirection: 'row',
                overflow: 'hidden',
                alignSelf: 'center',
                minHeight: RFValue(40),
                // alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: COLORS.white,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{...FONTS.h3, color: COLORS.black}}>
                  {item?.exam_name.trim()}
                </Text>
              </View>

              <View
                style={{
                  width: RFValue(50),
                  backgroundColor:
                    item?.solved_exam_score?.split('/')[0] >=
                    item?.solved_exam_score?.split('/')[1] / 2
                      ? COLORS.primary
                      : COLORS.red,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.white,
                  }}>
                  {item?.solved_exam_score}
                </Text>
              </View>
            </Animatable.View>
          )}
          ListHeaderComponent={
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.black,
                paddingHorizontal: SIZES.padding,
              }}>
              الإختبارات
            </Text>
          }
          ListEmptyComponent={
            !loadingPage && (
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
            )
          }
        />
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      {renderHeader()}
      <ScrollView>{renderBody()}</ScrollView>
    </View>
  );
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

export default ParentShowSub;
