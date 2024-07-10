import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';
import {SIZES, FONTS, COLORS, icons, images, lotties} from '../../../constants';
import {FormInput, Header, IconButton, TextButton} from '../../../components';
import AnimatedLottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import * as Animatable from 'react-native-animatable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyLoader from './Loader';
import {POST} from '../../../Helpers/ApiHelper';
import {ActivityIndicator, Divider} from 'react-native-paper';
import utils from '../../../utils';
const ProfInquiry = ({navigation}) => {
  const modalRef = useRef();
  const {netinfo} = useSelector(s => s.UserReducer);
  const {profSub, profData} = useSelector(s => s.ProfReducer);

  const [loadingPage, setLoadingPage] = useState(true);
  const [data, setData] = useState([]);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [selectedInque, setSelectedInque] = useState({});
  const [ansTxt, setAnsTxt] = useState('');
  useEffect(() => {
    getData();
  }, [netinfo]);
  async function getData() {
    let data_to_send = {
      subject_id: profSub?.subject_id,
    };

    let res = await POST('select_inquiry.php', data_to_send);
    if (res && Array.isArray(res)) {
      setData(
        res.map(item => {
          return {...item, delLoading: false};
        }),
      );
    }
    setLoadingPage(false);
  }

  async function _replyInque() {
    console.log(profData);
    setAddLoading(true);
    let data_to_send = {
      answer: ansTxt.trim(),
      doctor_id: profData?.doctor_id,
      question_id: selectedInque?.ask_id,
    };
    let res = await POST('doctor/answer_inquiry.php', data_to_send);
    if (res) {
      utils.toastAlert(
        'success',
        'إستفسارات',
        'تم إضافة إستفسارك بنجاح وسيتم إختارك عند إتمام المراجعة',
      );
      modalRef.current.fadeOutDown(200).then(() => {
        setShowAnswerModal(false);
        setAnsTxt('');
        getData();
      });
    }
    setAddLoading(false);
  }

  async function _deleteInque(psItem) {
    setData(
      data.map(item => {
        return psItem?.ask_id == item?.ask_id
          ? {...item, delLoading: true}
          : item;
      }),
    );
    let data_to_send = {
      question_id: psItem?.ask_id,
    };
    let res = await POST('doctor/delete_inquiry.php', data_to_send);
    if (res) {
      utils.toastAlert('success', 'تم حذف الإستفسار بنجاح');
      setData(data.filter(item => item.ask_id != psItem?.ask_id));
    } else {
      setData(
        data.map(item => {
          return psItem?.ask_id == item?.ask_id
            ? {...item, delLoading: false}
            : item;
        }),
      );
    }
  }
  function renderHeader() {
    return (
      <Header
        title={'إستفسارات'}
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
  function renderBody() {
    if (loadingPage) {
      return (
        <View style={{flex: 1}}>
          <FlatList
            // numColumns={2}
            contentContainerStyle={{
              marginHorizontal: SIZES.padding,
            }}
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
          marginTop: SIZES.radius * 2,
          paddingHorizontal: SIZES.padding,
          paddingBottom: RFValue(70),
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({index, item}) => (
          <Animatable.View
            delay={index * 50}
            useNativeDriver
            animation={'fadeInLeftBig'}
            style={{
              backgroundColor: COLORS.white,
              // padding: SIZES.padding,
              borderRadius: SIZES.radius,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              marginVertical: RFValue(10),
              paddingTop: RFValue(15),
              overflow: 'visible',
            }}>
            <View
              style={{
                position: 'absolute',
                top: RFValue(-10),
                left: RFValue(10),
                backgroundColor: COLORS.primary,
                paddingHorizontal: 6,
                paddingVertical: 5,
                borderRadius: 4,
              }}>
              <Text
                style={{
                  ...FONTS.h4,
                  color: COLORS.white,
                }}>
                {++index}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'تأكيد حذف',
                  `تأكيد حذف الإستفسار ⚠️`,
                  [
                    {
                      text: 'حذف',
                      onPress: () => _deleteInque(item),
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
              style={{
                position: 'absolute',
                top: RFValue(-10),
                right: RFValue(10),
                backgroundColor: COLORS.white,
                paddingHorizontal: 6,
                paddingVertical: 5,
                borderRadius: 4,
              }}>
              {item?.delLoading ? (
                <ActivityIndicator color={COLORS.primary} size={28} />
              ) : (
                <Ionicons name="trash-outline" size={28} color={COLORS.red} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowAnswerModal(true);
                setSelectedInque(item);
                setAnsTxt(item?.answer || '');
              }}
              style={{
                padding: SIZES.base,
              }}>
              <Text style={{...FONTS.h4, color: COLORS.dark}}>
                س:- {item.title}
              </Text>
              <Divider />
              {item.confirm_ans == '1' ? (
                <>
                  <Text style={{...FONTS.h5, color: COLORS.gray}}>
                    {item.answer}
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={{
                      ...FONTS.h3,
                    }}>
                    {' '}
                    ⚠️ لم يتم الرد بعد{' '}
                  </Text>
                </>
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
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {renderHeader()}
      {renderBody()}

      <Modal
        // animationType="fade"
        transparent
        visible={showAnswerModal}
        onRequestClose={() => {
          modalRef.current.fadeOutDown(200).then(() => {
            setShowAnswerModal(false);
          });
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            backgroundColor: COLORS.darkOverlayColor,
          }}>
          <TouchableOpacity
            style={{...StyleSheet.absoluteFill}}
            onPress={() => {
              modalRef.current.fadeOutDown(200).then(() => {
                setShowAnswerModal(false);
              });
            }}></TouchableOpacity>
          <Animatable.View
            ref={modalRef}
            animation="fadeInUp"
            useNativeDriver
            style={{
              backgroundColor: COLORS.white,
              borderTopRightRadius: SIZES.radius,
              borderTopLeftRadius: SIZES.radius,
              padding: SIZES.padding,
              width: '100%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{flex: 1, ...FONTS.h3, color: COLORS.black}}>
                الرد على سؤال
              </Text>
              <IconButton
                containerStyle={{
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor: COLORS.gray2,
                }}
                icon={icons.cross}
                iconStyle={{
                  tintColor: COLORS.gray2,
                }}
                onPress={() => {
                  modalRef.current.fadeOutDown(200).then(() => {
                    setShowAnswerModal(false);
                  });
                }}
              />
            </View>
            <Text
              numberOfLines={3}
              style={{
                ...FONTS.h4,
                color: COLORS.black,
              }}>
              {selectedInque?.title}
            </Text>
            <FormInput
              multiline={true}
              placeholder={'إستفسارك!'}
              maxHeight={RFValue(100)}
              containerStyle={{
                width: '100%',
                alignSelf: 'center',
                marginVertical: RFValue(15),
              }}
              inputStyle={{
                fontFamily: FONTS.fontFamily,
              }}
              value={ansTxt}
              onChange={value => {
                setAnsTxt(value);
              }}
            />
            <TextButton
              label="تأكيد"
              loading={addLoading}
              disabled={addLoading}
              buttonContainerStyle={{
                height: 50,
                borderRadius: SIZES.base,
                backgroundColor: COLORS.primary,
              }}
              onPress={() => {
                _replyInque();
              }}
            />
          </Animatable.View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfInquiry;
