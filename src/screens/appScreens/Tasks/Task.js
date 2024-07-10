import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  BackHandler,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLORS, FONTS, SIZES, images, icons, lotties} from '../../../constants';
import {Header, IconButton} from '../../../components';
import {MotiView, useAnimationState} from 'moti';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, RadioButton} from 'react-native-paper';
import PDFView from 'react-native-view-pdf';
import AnimatedLottieView from 'lottie-react-native';
import utils from '../../../utils';
import {POST} from '../../../Helpers/ApiHelper';
import {useSelector} from 'react-redux';
import CountDown from 'react-native-countdown-component';

const Task = ({navigation, route}) => {
  const {psData} = route.params;
  const {subjectData} = useSelector(s => s.UserReducer);

  const {userData} = useSelector(s => s.UserReducer);
  const [mode, setMode] = useState('pdf');
  const [pdfLoading, setPdfLoading] = useState(true);
  const [finishExamLoading, setFinishExamLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [exam, setExam] = useState([]);
  const animationState = useAnimationState({
    pdf: {
      height: SIZES.height - SIZES.padding,
      //   opacity: 1,
      //   translateX: SIZES.width,
    },
    bubble: {
      height: SIZES.height - SIZES.padding,
    },
  });
  useEffect(() => {
    animationState.transitionTo('pdf');
    getData();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const backAction = () => {
    Alert.alert(
      'تنبية ⚠️',
      'فى حالة الرجوع سوف يتم تصحيح التاسك وتأكيد الإنتهاء',
      [
        {
          text: 'إغلاق',
          onPress: () => console.log('cancel mark whole exam'),
        },
        {
          text: 'إنهاء التاسك',
          style: 'cancel',
          onPress: () => markAllExam(),
        },
      ],
      {
        cancelable: true,
      },
    );
    return true;
  };
  async function getData() {
    let data_to_send = {
      exam_id: psData?.exam_id,
    };
    let res = await POST('select_questions.php', data_to_send);
    if (res && Array.isArray(res.questions)) {
      setExam(res.questions);
    }
    setPageLoading(false);
  }

  async function markAllExam() {
    setFinishExamLoading(true);
    let fullMark = exam.length;
    let studenDegree = 0;
    let allQuestions = [...exam];
    let AllQuestionString = '';

    for (let i = 0; i < allQuestions.length; i++) {
      let question = allQuestions[i];
      if (
        question.question_valid_answer.trim() == question.chosen_answer.trim()
      ) {
        studenDegree++;
        if (i == allQuestions.length - 1) {
          AllQuestionString +=
            allQuestions[i]?.question_id +
            '***' +
            '1' +
            '***' +
            allQuestions[i]?.chosen_answer;
        } else {
          AllQuestionString +=
            allQuestions[i]?.question_id +
            '***' +
            '1' +
            '***' +
            allQuestions[i]?.chosen_answer +
            '***camp_coding***';
        }
      } else {
        if (i == allQuestions.length - 1) {
          AllQuestionString +=
            allQuestions[i]?.question_id +
            '***' +
            '0' +
            '***' +
            allQuestions[i]?.chosen_answer;
        } else {
          AllQuestionString +=
            allQuestions[i]?.question_id +
            '***' +
            '0' +
            '***' +
            allQuestions[i]?.chosen_answer +
            '***camp_coding***';
        }
      }
    }

    let data_to_send = {
      id: psData?.exam_id,
      student_id: userData?.student_id,
      score: `${studenDegree}/${fullMark}`,
      all_question: AllQuestionString,
      subject_id: subjectData?.subject_id,
    };
    let res = await POST('upload_score.php', data_to_send);
    if (res) {
      utils.toastAlert(
        'success',
        'إنهاء التاسك',
        `الدرجة النهائية ${studenDegree}/${fullMark}`,
      );
      setTimeout(() => {
        navigation.goBack();
      }, 1100);
    }
  }
  function markAnswer(ans, quIndex) {
    let allQuestions = [...exam];
    allQuestions.map(
      (item, index) =>
        (item.chosen_answer = index == quIndex ? ans : item.chosen_answer),
    );
    setExam(allQuestions);
  }
  function renderPDF() {
    return (
      <MotiView state={animationState}>
        <View style={{height: SIZES.height - SIZES.padding * 5}}>
          {/* Some Controls to change PDF resource */}

          <PDFView
            fadeInDuration={250.0}
            style={{flex: 1}}
            resource={psData?.papel_link}
            resourceType={'url'}
            onLoad={() => setPdfLoading(false)}
            onError={error => {}}
          />
          {pdfLoading ? (
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AnimatedLottieView
                source={lotties.loading_animation_blue}
                autoPlay
                loop
                style={{width: '100%'}}
              />
            </View>
          ) : null}
        </View>
      </MotiView>
    );
  }

  function renderQuestions(item, index) {
    return (
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 10,
          borderRadius: 8,
          marginVertical: RFValue(10),
        }}>
        <View
          style={{
            position: 'absolute',
            backgroundColor: COLORS.gray2,
            borderRadius: 8,
            padding: 4,
            paddingHorizontal: 8,
            top: RFValue(-10),
          }}>
          <Text>•{index + 1}•</Text>
        </View>

        <RadioButton.Group
          onValueChange={newValue => {
            markAnswer(newValue, index);
          }}
          value={item?.chosen_answer}>
          <View
            style={{
              flexDirection: 'row',
              // width: '100%',
              alignItems: 'center',
              justifyContent: 'space-around',
              // flexWrap: 'wrap',
              // flex: 1,
            }}>
            {item?.question_answers?.split('//CAMP//').map((item, index) => (
              <View
                key={`qa-${index}`}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <RadioButton color={COLORS.primary} value={item} />
                <Text style={{...FONTS.h4, color: COLORS.black}}>{item}</Text>
              </View>
            ))}
          </View>
        </RadioButton.Group>
        {/* </View> */}
      </View>
    );
  }
  function renderBubble() {
    return (
      <MotiView state={animationState}>
        <View style={{height: SIZES.height - SIZES.padding * 5}}>
          <FlatList
            key={'qu'}
            data={exam}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => `#-${index}`}
            renderItem={({item, index}) => renderQuestions(item, index)}
            ListFooterComponent={() => {
              return (
                <Button
                  loading={finishExamLoading}
                  disabled={finishExamLoading}
                  style={{
                    marginBottom: exam?.length * 10,
                    borderRadius: SIZES.base,
                  }}
                  buttonColor={COLORS.primary}
                  mode="contained"
                  labelStyle={{...FONTS.h3}}
                  onPress={() => {
                    Alert.alert(
                      'تنبية ⚠️',
                      'تأكيد إنهاء التاسك',
                      [
                        {
                          text: 'إغلاق',
                          onPress: () => console.log('cancel mark whole exam'),
                        },
                        {
                          text: 'إنهاء التاسك',
                          style: 'cancel',
                          onPress: () => markAllExam(),
                        },
                      ],
                      {
                        cancelable: true,
                      },
                    );
                  }}>
                  إنهاء
                </Button>
              );
            }}
          />
        </View>
      </MotiView>
    );
  }

  function renderAuthContainer() {
    if (mode == 'pdf') {
      return renderPDF();
    } else {
      return renderBubble();
    }
  }

  function renderHeader() {
    return (
      <Header
        title={psData?.exam_name}
        containerStyle={{
          height: 50,
          // marginHorizontal: SIZES.padding,
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
        rightComponent={
          psData?.exam_time > 0 ? (
            <View
              style={{
                flex: 1,
                // marginLeft: 4,
                backgroundColor: COLORS.greenAlpha,
                borderRadius: 8,
                // backgroundColor:"red"
              }}>
              <CountDown
                style={{
                  width: RFValue(20),
                  opacity: 1,
                  alignSelf: 'center',
                }}
                size={16}
                until={psData?.exam_time * 60}
                onFinish={() => {
                  markAllExam();
                }}
                digitStyle={{width: 30, height: 40}}
                digitTxtStyle={{color: COLORS.black}}
                timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                separatorStyle={{color: 'black'}}
                timeToShow={['S', 'M', 'H']}
                timeLabels={{h: null, m: null, s: ''}}
                showSeparator
              />
            </View>
          ) : (
            <View style={{width: 40}} />
          )
        }
        twoRight={true}
      />
    );
  }
  function renderToggleBtns() {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: RFValue(8),
            // paddingHorizontal: SIZES.padding,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Button
            onPress={() => {
              animationState.transitionTo('pdf');
              //   setPdfLoading(true);
              setMode('pdf');
            }}
            mode="contained"
            labelStyle={{
              ...FONTS.h4,
              color: mode == 'pdf' ? COLORS.white : COLORS.black,
            }}
            buttonColor={mode == 'pdf' ? COLORS.primary : COLORS.lightGray3}
            style={{
              borderRadius: SIZES.base,
              width: '48%',
            }}>
            PDF
          </Button>
          <Button
            onPress={() => {
              animationState.transitionTo('bubble');

              setMode('bubble');
            }}
            mode="contained"
            labelStyle={{
              ...FONTS.h4,
              color: mode == 'bubble' ? COLORS.white : COLORS.black,
            }}
            style={{
              borderRadius: SIZES.base,
              width: '48%',
            }}
            buttonColor={mode == 'bubble' ? COLORS.primary : COLORS.lightGray3}>
            Answer Sheet
          </Button>
        </View>
      </>
    );
  }

  return (
    <View
      style={{
        ...styles.container,
      }}>
      {renderHeader()}
      {pageLoading ? (
        <>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AnimatedLottieView
              source={lotties.loading_animation_blue}
              autoPlay
              loop
              style={{width: RFValue(200), height: RFValue(200)}}
              resizeMode="contain"
            />
          </View>
        </>
      ) : (
        <>
          {renderToggleBtns()}

          {renderAuthContainer()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.lightGray,
  },
  pageContainer: {
    // flex: 1,
    // width: '100%',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.red,
    // flexGrow: 1,
    // alignSelf: 'center',
    // zIndex: 1,
  },
});

export default Task;
