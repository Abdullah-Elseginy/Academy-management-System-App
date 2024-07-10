import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {COLORS, FONTS, icons, images, lotties, SIZES} from '../../../constants';
import {RFValue} from 'react-native-responsive-fontsize';
import {Header, IconButton} from '../../../components';
import AnimatedLottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import {POST} from '../../../Helpers/ApiHelper';
import MyLoader from '../../HomeLoader';
import {
  Button,
  Checkbox,
  IconButton as PaperIconButton,
} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {useIsFocused} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import utils from '../../../utils';
const ProfTasks = ({navigation}) => {
  const examOptionsRef = useRef();
  const isFocused = useIsFocused();

  const {netinfo} = useSelector(s => s.UserReducer);
  const {profSub} = useSelector(s => s.ProfReducer);
  const [data, setData] = useState([]);
  // Loading
  const [loadingPage, setLoadingPage] = useState(true);
  const [addExamLoading, setAddExamLoading] = useState(false);
  const [editExamLoading, setEditExamLoading] = useState(false);

  const [deleteExamLoading, setDeleteExamLoading] = useState(false);
  const [showExamLoading, setShowExamLoading] = useState(false);

  const [visableAddExamModal, setVisableAddExamModal] = useState(false);
  const [visableEditExamModal, setVisableEditExamModal] = useState(false);

  // Add Vars
  const [examName, setExamName] = useState('');
  const [examTime, setExamTime] = useState('');
  const [showExamTime, setShowExamTime] = useState(false);
  const [showExamTimeOnEdit, setShowExamTimeOnEdit] = useState(false);

  const [examDate, setExamDate] = useState('');
  const [visableExamDatePicker, setVisableExamDatePicker] = useState(false);
  const [visableExamDatePickerOnEdit, setVisableExamDatePickerOnEdit] =
    useState(false);

  const [examStart, setExamStart] = useState('');
  const [visableStartExamTimePicker, setVisableStartExamTimePicker] =
    useState(false);

  const [
    visableStartExamTimePickerOnEdit,
    setVisableStartExamTimePickerOnEdit,
  ] = useState(false);
  const [examEnd, setExamEnd] = useState('');
  const [visableEndtExamTimePicker, setVisableEndtExamTimePicker] =
    useState(false);
  const [visableEndtExamTimePickerOnEdit, setVisableEndtExamTimePickeronEdit] =
    useState(false);
  //
  const [selectedExam, setSelectedExam] = useState({});
  const [visableSelectedExamOptions, setVisableSelectedExamOptions] =
    useState(false);

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused]);

  async function getData() {
    setLoadingPage(true);
    let data_to_send = {
      subject_id: profSub?.subject_id,
    };

    let res = await POST('doctor/select_exam.php', data_to_send);
    if (res && Array.isArray(res)) {
      setData(res);
    }
    setLoadingPage(false);
  }

  async function _CheckAddExam() {
    if (examName == '') {
      Toast.showWithGravity(
        'برجاء كتابة إسم التاسك',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    if (showExamTime && examTime == '') {
      Toast.showWithGravity(
        'برجاء كتابة مدة التاسك',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    if (showExamTime && examTime * 0 != 0) {
      Toast.showWithGravity(
        'برجاء كتابة مدة التاسك بشكل صحيح',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    if (examDate == '') {
      Toast.showWithGravity(
        'برجاء تحديد تاريخ التاسك',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }

    if (examStart == '') {
      Toast.showWithGravity(
        'برجاء تحديد وقت بدء التاسك',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    if (examEnd == '') {
      Toast.showWithGravity(
        'برجاء تحديد وقت  نهاية التاسك',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    setAddExamLoading(true);
    let data_to_send = {
      exam_name: examName.trim(),
      exam_time: showExamTime ? examTime.trim() : '0',
      exam_date: moment(examDate).locale('en').format('YYYY-MM-DD'),
      exam_start: moment(examStart).locale('en').format('HH:mm:ss'),
      exam_end: moment(examEnd).locale('en').format('HH:mm:ss'),
      subject_id: profSub?.subject_id,
    };
    console.log(data_to_send);

    let res = await POST('doctor/add_exam.php', data_to_send);

    if (res) {
      onCloseAddModal();
      utils.toastAlert('success', 'تم إضافة التاسك بنجاح');
      getData();
    }
    setAddExamLoading(false);
  }

  async function _CheckEditExam() {
    if (selectedExam?.exam_name == '') {
      Toast.showWithGravity(
        'برجاء كتابة إسم التاسك',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    if (showExamTimeOnEdit && selectedExam?.exam_time == '') {
      Toast.showWithGravity(
        'برجاء كتابة مدة التاسك',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    if (showExamTimeOnEdit && selectedExam?.exam_time * 0 != 0) {
      Toast.showWithGravity(
        'برجاء كتابة مدة التاسك بشكل صحيح',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    if (selectedExam?.exam_date == '') {
      Toast.showWithGravity(
        'برجاء تحديد تاريخ التاسك',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }

    if (selectedExam?.exam_start_time == '') {
      Toast.showWithGravity(
        'برجاء تحديد وقت بدء التاسك',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    if (selectedExam?.exam_end_time == '') {
      Toast.showWithGravity(
        'برجاء تحديد وقت  نهاية التاسك',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    setEditExamLoading(true);
    let data_to_send = {
      exam_name: selectedExam?.exam_name.trim(),
      exam_time: showExamTimeOnEdit ? selectedExam?.exam_time.trim() : '0',
      exam_date: moment(selectedExam?.exam_date)
        .locale('en')
        .format('YYYY-MM-DD'),
      exam_start: selectedExam?.exam_start_time,
      exam_end: selectedExam?.exam_end_time,
      exam_id: selectedExam?.exam_id,
    };
    console.log(data_to_send);

    let res = await POST('doctor/edit_exam.php', data_to_send);

    if (res) {
      onCloseEditModal();
      utils.toastAlert('success', 'تم تعديل التاسك بنجاح');
      getData();
    }
    setEditExamLoading(false);
  }

  async function _deleteExam() {
    let data_to_send = {exam_id: selectedExam?.exam_id};
    setDeleteExamLoading(true);
    let res = await POST('doctor/delete_exam.php', data_to_send);
    if (res) {
      utils.toastAlert('success', 'تم حذف التاسك بنجاح');
      getData();
      examOptionsRef.current.fadeOutDownBig(600).then(() => {
        setVisableSelectedExamOptions(false);
        setSelectedExam({});
      });
    }
    setDeleteExamLoading(false);
  }

  async function _showExam() {
    setShowExamLoading(true);
    let data_to_send = {
      exam_id: selectedExam?.exam_id,
      subject_id: selectedExam?.subject_id,
      value: selectedExam?.show == '0' ? '1' : '0',
    };
    let res = await POST('doctor/update_exam_show_to_answer.php', data_to_send);
    if (res) {
      utils.toastAlert(
        'success',
        selectedExam?.show == '0'
          ? 'تم إظهار التاسك بنجاح'
          : 'تم حجب التاسك بنجاح',
      );
      setSelectedExam({
        ...selectedExam,
        show: selectedExam?.show == '0' ? '1' : '0',
      });
      let allData = [...data];
      let indexOfExam = allData.findIndex(
        item => item.exam_id == selectedExam?.exam_id,
      );
      allData[indexOfExam].show = selectedExam?.show == '0' ? '1' : '0';
      setData(allData);
    }
    setShowExamLoading(false);
  }

  function onCloseAddModal() {
    setVisableAddExamModal(false);
    setExamName('');
    setExamTime('');
    setExamDate('');
    setExamStart('');
    setExamEnd('');
    setShowExamTime(false);
  }
  function onCloseEditModal() {
    setVisableEditExamModal(false);
    setSelectedExam({});
    setVisableSelectedExamOptions(false);
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
          paddingBottom: SIZES.padding * 2 + RFValue(40),
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
                  // justifyContent: 'center',
                }
              }
              onPress={() => {
                setSelectedExam(item);
                setVisableSelectedExamOptions(true);
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
      {!loadingPage && (
        <TouchableOpacity
          onPress={() => {
            setVisableAddExamModal(true);
          }}
          style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
            width: RFValue(40),
            height: RFValue(40),
            borderRadius: RFValue(40 / 2),
          }}>
          <Feather name="plus" size={24} color={COLORS.white} />
        </TouchableOpacity>
      )}

      {/* Add Exam Modal */}

      <Modal
        visible={visableAddExamModal}
        transparent
        animationType="fade"
        onRequestClose={onCloseAddModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.darkOverlayColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={{...StyleSheet.absoluteFill}}
            onPress={onCloseAddModal}></TouchableOpacity>
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: SIZES.radius,
              padding: SIZES.padding,
              width: '90%',
              height: '80%',
            }}>
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              extraScrollHeight={-300}
              showsVerticalScrollIndicator={false}>
              {/* Exam Name */}
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                إسم التاسك
              </Text>
              <TextInput
                style={{
                  backgroundColor: COLORS.lightGray,
                  borderRadius: SIZES.base,
                  ...FONTS.h3,
                  paddingHorizontal: 8,
                  marginVertical: SIZES.base,
                  minHeight: RFValue(40),
                }}
                placeholder="أدخل إسم التاسك"
                value={examName}
                onChangeText={val => setExamName(val)}
              />
              {/* Exam Time */}
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
                  هل يوجد وقت لتاسك؟
                </Text>
                <Checkbox
                  color={COLORS.primary}
                  status={showExamTime ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setShowExamTime(!showExamTime);
                  }}
                />
              </View>
              {showExamTime && (
                <TextInput
                  style={{
                    backgroundColor: COLORS.lightGray,
                    borderRadius: SIZES.base,
                    ...FONTS.h3,
                    paddingHorizontal: 8,
                    marginVertical: SIZES.base,
                    minHeight: RFValue(40),
                  }}
                  keyboardType="number-pad"
                  placeholder="أدخل مدة التاسك بالدقائق"
                  value={examTime}
                  onChangeText={val => setExamTime(val)}
                />
              )}

              {/* Exam Date */}
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                تاريخ بدء التاسك
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisableExamDatePicker(true);
                }}
                style={{
                  backgroundColor: COLORS.lightGray,
                  borderRadius: SIZES.base,
                  paddingHorizontal: 8,
                  marginVertical: SIZES.base,
                  minHeight: RFValue(40),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.black,
                  }}>
                  {examDate
                    ? moment(examDate).format('LL')
                    : 'حدد تاريخ التاسك'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                minimumDate={new Date()}
                isVisible={visableExamDatePicker}
                mode="date"
                onConfirm={e => {
                  setExamDate(e);
                  setVisableExamDatePicker(false);
                }}
                onCancel={() => {
                  setVisableExamDatePicker(false);
                }}
              />
              {/* Exam Start Time */}
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                وقت بدء التاسك
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisableStartExamTimePicker(true);
                }}
                style={{
                  backgroundColor: COLORS.lightGray,
                  borderRadius: SIZES.base,
                  paddingHorizontal: 8,
                  marginVertical: SIZES.base,
                  minHeight: RFValue(40),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.black,
                  }}>
                  {examStart
                    ? moment(examStart).format('LT A')
                    : 'حدد وقت بدء التاسك'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                minimumDate={new Date()}
                isVisible={visableStartExamTimePicker}
                mode="time"
                onConfirm={e => {
                  setExamStart(e);
                  setVisableStartExamTimePicker(false);
                }}
                onCancel={() => {
                  setVisableStartExamTimePicker(false);
                }}
              />
              {/* Exam End Time */}
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                وقت نهاية التاسك
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisableEndtExamTimePicker(true);
                }}
                style={{
                  backgroundColor: COLORS.lightGray,
                  borderRadius: SIZES.base,
                  paddingHorizontal: 8,
                  marginVertical: SIZES.base,
                  minHeight: RFValue(40),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.black,
                  }}>
                  {examEnd
                    ? moment(examEnd).format('LT A')
                    : 'حدد وقت نهاية التاسك'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                minimumDate={new Date()}
                isVisible={visableEndtExamTimePicker}
                mode="time"
                onConfirm={e => {
                  setExamEnd(e);
                  setVisableEndtExamTimePicker(false);
                }}
                onCancel={() => {
                  setVisableEndtExamTimePicker(false);
                }}
              />
            </KeyboardAwareScrollView>
            <Button
              onPress={_CheckAddExam}
              loading={addExamLoading}
              disabled={addExamLoading}
              mode="contained"
              buttonColor={COLORS.primary}
              labelStyle={{
                ...FONTS.h3,
                color: COLORS.white,
              }}
              style={{
                borderRadius: SIZES.base,
              }}>
              إنشاء تاسك
            </Button>
          </View>
        </View>
      </Modal>
      {/* Selected Exam Options */}
      <Modal
        transparent
        visible={visableSelectedExamOptions}
        onRequestClose={() => {
          examOptionsRef.current.fadeOutDownBig(600).then(() => {
            setVisableSelectedExamOptions(false);
            setSelectedExam({});
          });
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.darkOverlayColor,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            style={{...StyleSheet.absoluteFill}}
            onPress={() => {
              examOptionsRef.current.fadeOutDownBig(600).then(() => {
                setVisableSelectedExamOptions(false);
                setSelectedExam({});
              });
            }}></TouchableOpacity>
          <Animatable.View
            ref={examOptionsRef}
            animation={'fadeInUpBig'}
            style={{
              backgroundColor: COLORS.white,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: SIZES.padding,
              width: '100%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  ...FONTS.h4,
                  color: COLORS.black,
                }}>
                {selectedExam?.exam_name}
              </Text>
              <PaperIconButton
                // size={40}
                icon={() => (
                  <Ionicons
                    name="md-close-sharp"
                    size={28}
                    color={COLORS.black}
                  />
                )}
                onPress={() => {
                  examOptionsRef.current.fadeOutDownBig(600).then(() => {
                    setVisableSelectedExamOptions(false);
                    setSelectedExam({});
                  });
                }}
              />
            </View>
            <Button
              onPress={() => {
                _showExam();
              }}
              disabled={showExamLoading}
              mode="contained"
              labelStyle={{...FONTS.h3, color: COLORS.white}}
              buttonColor={COLORS.primary}
              style={{marginBottom: RFValue(5), borderRadius: SIZES.base}}>
              {selectedExam?.show == '0' ? 'إظهار' : 'إخفاء'} التاسك
            </Button>
            <Button
              onPress={() => {
                navigation.navigate('ProfTaskQuestions', {
                  psData: selectedExam,
                });
                examOptionsRef.current.fadeOutDownBig(600).then(() => {
                  setVisableSelectedExamOptions(false);
                  setSelectedExam({});
                });
              }}
              disabled={deleteExamLoading}
              mode="contained"
              labelStyle={{...FONTS.h3, color: COLORS.white}}
              buttonColor={COLORS.primary}
              style={{marginBottom: RFValue(5), borderRadius: SIZES.base}}>
              تعديل وعرض عرض الأسئلة
            </Button>
            <Button
              onPress={() => {
                // console.log(selectedExam?.exam_time > 0);
                setShowExamTimeOnEdit(selectedExam?.exam_time > 0);
                setVisableEditExamModal(true);
                // examOptionsRef.current.fadeOutDownBig(600).then(() => {
                //   setVisableSelectedExamOptions(false);
                //   setSelectedExam({});
                // });
              }}
              disabled={deleteExamLoading}
              mode="contained"
              labelStyle={{...FONTS.h3, color: COLORS.white}}
              buttonColor={COLORS.support4}
              style={{marginBottom: RFValue(5), borderRadius: SIZES.base}}>
              تعديل التاسك
            </Button>
            <Button
              onPress={() => {
                Alert.alert(
                  'تأكيد حذف',
                  `تأكيد حذف تاسك ( ${selectedExam?.exam_name} )⚠️`,
                  [
                    {
                      text: 'حذف',
                      onPress: () => _deleteExam(),
                    },
                    {
                      text: 'إلغاء',
                      onPress: () => console.log('cancel delete exam'),
                    },
                  ],
                  {
                    cancelable: true,
                  },
                );
              }}
              disabled={deleteExamLoading}
              loading={deleteExamLoading}
              mode="contained"
              labelStyle={{...FONTS.h3, color: COLORS.white}}
              buttonColor={COLORS.red}
              style={{marginBottom: RFValue(5), borderRadius: SIZES.base}}>
              حذف
            </Button>
          </Animatable.View>
        </View>
      </Modal>

      {/* Edit Exam Modal */}

      <Modal
        visible={visableEditExamModal}
        transparent
        animationType="fade"
        onRequestClose={onCloseEditModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.darkOverlayColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={{...StyleSheet.absoluteFill}}
            onPress={onCloseEditModal}></TouchableOpacity>
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: SIZES.radius,
              padding: SIZES.padding,
              width: '90%',
              height: '80%',
            }}>
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              extraScrollHeight={-300}
              showsVerticalScrollIndicator={false}>
              {/* Exam Name */}
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                إسم التاسك
              </Text>
              <TextInput
                style={{
                  backgroundColor: COLORS.lightGray,
                  borderRadius: SIZES.base,
                  ...FONTS.h3,
                  paddingHorizontal: 8,
                  marginVertical: SIZES.base,
                  minHeight: RFValue(40),
                }}
                placeholder="أدخل إسم التاسك"
                value={selectedExam?.exam_name}
                onChangeText={val =>
                  setSelectedExam({...selectedExam, exam_name: val})
                }
              />
              {/* Exam Time */}
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
                  هل يوجد وقت لتاسك؟
                </Text>
                <Checkbox
                  color={COLORS.primary}
                  status={showExamTimeOnEdit ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setShowExamTimeOnEdit(!showExamTimeOnEdit);
                  }}
                />
              </View>
              {showExamTimeOnEdit && (
                <TextInput
                  style={{
                    backgroundColor: COLORS.lightGray,
                    borderRadius: SIZES.base,
                    ...FONTS.h3,
                    paddingHorizontal: 8,
                    marginVertical: SIZES.base,
                    minHeight: RFValue(40),
                  }}
                  keyboardType="number-pad"
                  placeholder="أدخل مدة التاسك بالدقائق"
                  value={selectedExam?.exam_time}
                  onChangeText={val =>
                    setSelectedExam({...selectedExam, exam_time: val})
                  }
                />
              )}

              {/* Exam Date */}
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                تاريخ بدء التاسك
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisableExamDatePickerOnEdit(true);
                }}
                style={{
                  backgroundColor: COLORS.lightGray,
                  borderRadius: SIZES.base,
                  paddingHorizontal: 8,
                  marginVertical: SIZES.base,
                  minHeight: RFValue(40),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.black,
                  }}>
                  {selectedExam?.exam_date
                    ? moment(selectedExam?.exam_date).format('LL')
                    : 'حدد تاريخ التاسك'}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                minimumDate={new Date()}
                isVisible={visableExamDatePickerOnEdit}
                mode="date"
                onConfirm={e => {
                  setSelectedExam({...selectedExam, exam_date: e});
                  setVisableExamDatePickerOnEdit(false);
                }}
                onCancel={() => {
                  setVisableExamDatePickerOnEdit(false);
                }}
              />
              {/* Exam Start Time */}
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                وقت بدء التاسك
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisableStartExamTimePickerOnEdit(true);
                }}
                style={{
                  backgroundColor: COLORS.lightGray,
                  borderRadius: SIZES.base,
                  paddingHorizontal: 8,
                  marginVertical: SIZES.base,
                  minHeight: RFValue(40),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.black,
                  }}>
                  {selectedExam?.exam_start_time}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                minimumDate={new Date()}
                isVisible={visableStartExamTimePickerOnEdit}
                mode="time"
                onConfirm={e => {
                  setSelectedExam({
                    ...selectedExam,
                    exam_start_time: moment(e).locale('en').format('HH:mm:ss'),
                  });
                  setVisableStartExamTimePickerOnEdit(false);
                }}
                onCancel={() => {
                  setVisableStartExamTimePickerOnEdit(false);
                }}
              />
              {/* Exam End Time */}
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                وقت نهاية التاسك
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisableEndtExamTimePickeronEdit(true);
                }}
                style={{
                  backgroundColor: COLORS.lightGray,
                  borderRadius: SIZES.base,
                  paddingHorizontal: 8,
                  marginVertical: SIZES.base,
                  minHeight: RFValue(40),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    ...FONTS.h3,
                    color: COLORS.black,
                  }}>
                  {selectedExam?.exam_end_time}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                minimumDate={new Date()}
                isVisible={visableEndtExamTimePickerOnEdit}
                mode="time"
                onConfirm={e => {
                  setSelectedExam({
                    ...selectedExam,
                    exam_end_time: moment(e).locale('en').format('HH:mm:ss'),
                  });

                  setVisableEndtExamTimePickeronEdit(false);
                }}
                onCancel={() => {
                  setVisableEndtExamTimePickeronEdit(false);
                }}
              />
            </KeyboardAwareScrollView>
            <Button
              onPress={_CheckEditExam}
              loading={editExamLoading}
              disabled={editExamLoading}
              mode="contained"
              buttonColor={COLORS.primary}
              labelStyle={{
                ...FONTS.h3,
                color: COLORS.white,
              }}
              style={{
                borderRadius: SIZES.base,
              }}>
              تعديل تاسك
            </Button>
          </View>
        </View>
      </Modal>
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

export default ProfTasks;
