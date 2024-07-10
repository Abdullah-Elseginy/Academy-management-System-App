import React, {useState, useEffect} from 'react';

import {View, Text, ScrollView, Modal, FlatList, Alert} from 'react-native';
import {POST} from '../../../Helpers/ApiHelper';
import {
  AppData,
  COLORS,
  FONTS,
  SIZES,
  icons,
  lotties,
} from '../../../constants';
import AnimatedLottieView from 'lottie-react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Header, IconButton} from '../../../components';
import {useSelector} from 'react-redux';
import {ActivityIndicator, Button, RadioButton} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import PDFView from 'react-native-view-pdf';
import utils from '../../../utils';
import RNFetchBlob from 'rn-fetch-blob';

const ProfTaskQuestions = ({navigation, route}) => {
  const {psData} = route.params;
  console.log(psData);
  const [passedExamData, setPassedExamData] = useState({});
  const [exam, setExam] = useState([]);
  const {netinfo} = useSelector(s => s.UserReducer);
  //
  const [pdfLoading, setPdfLoading] = useState(true);
  const [visablePdfModal, setVisablePdfModal] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);
  const [uploadPdfLoading, setUploadPdfLoading] = useState(false);
  const [addQuesLoading, setAddQuesLoading] = useState(false);

  useEffect(() => {
    setPassedExamData(psData);
    getExamQuestions();
  }, []);
  async function getExamQuestions() {
    let data_to_send = {
      exam_id: psData?.exam_id,
    };
    let res = await POST('select_questions.php', data_to_send);
    if (res && Array.isArray(res.questions)) {
      let allData = res.questions.map(item => {
        return {...item, loading: false, delLoading: false};
      });
      setExam(allData);
    }
    setPageLoading(false);
  }

  async function _addPDF() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      uploadPDF(res);
    } catch (err) {}
  }
  async function uploadPDF(file) {
    if (file != null) {
      setUploadPdfLoading(true);

      const data = new FormData();
      data.append('file_attachment', file);
      data.append('exam_id', psData?.exam_id);

      let res = await fetch(
        AppData.domain + 'doctor/upload_exam_papel_pdf.php',
        {
          method: 'post',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data; ',
          },
        },
      );
      let responseJson = await res.json();
      if (responseJson.status == 'success') {
        utils.toastAlert('success', 'تم الرفع بنجاح');
        setPassedExamData({
          ...passedExamData,
          papel_link: file.uri,
        });
      } else {
        utils.toastAlert(
          'error',
          responseJson.message || 'حدث خطأ ما برجاء المحاولة لاحقا',
        );
      }
      setUploadPdfLoading(false);
    } else {
      utils.toastAlert('error', 'عفوا يجب اختيار الملف اولا');
    }
  }

  async function _addQuestion() {
    setAddQuesLoading(true);
    let obj = {
      question_id: 0,
      question_answers: 'A//CAMP//B//CAMP//C//CAMP//D',
      question_image: null,
      question_text: 'إختر',
      question_valid_answer: 'A',
    };

    RNFetchBlob.fetch(
      'POST',
      AppData.domain + 'doctor/add_ques.php',
      {
        Authorization: 'Bearer access-token',
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      [
        // element with property `filename` will be transformed into `file` in form data
        {
          name: 'question_text',
          data: obj.question_text,
        },
        {
          name: 'question_answers',
          data: obj.question_answers,
        },
        {
          name: 'question_valid_answer',
          data: obj.question_valid_answer,
        },
        {
          name: 'question_exam_quiz_id',
          data: psData?.exam_id,
        },
      ],
    )
      .then(resp => {
        let data = JSON.parse(resp.data);
        if (data.status == 'success') {
          getExamQuestions();
          utils.toastAlert('success', 'تم إضافة السؤال بنجاح');
        } else {
          utils.toastAlert(
            'error',
            data?.message || '..حدث خطأ ما برجاء المحاولة لاحقا',
          );
        }
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        setAddQuesLoading(false);
      });
  }

  async function delete_question(psItem) {
    let data_to_send = {
      question_id: psItem?.question_id,
    };
    setExam(
      exam.map(item => {
        return item.question_id == psItem.question_id
          ? {...item, delLoading: true}
          : item;
      }),
    );
    let res = await POST('doctor/delete_ques.php', data_to_send);
    if (res) {
      utils.toastAlert('success', 'تم حذف السؤال بنجاح');
      setExam(exam.filter(item => item.question_id != psItem.question_id));
    } else {
      setExam(
        exam.map(item => {
          return item.question_id == psItem.question_id
            ? {...item, delLoading: false}
            : item;
        }),
      );
    }
  }
  async function modifyAnswer(newValue, psItem) {
    let data_to_send = {
      question_id: psItem?.question_id,
      question_valid_answer: newValue,
    };
    setExam(
      exam.map(item => {
        return item.question_id == psItem.question_id
          ? {...item, loading: true}
          : item;
      }),
    );
    let res = await POST('doctor/edit_ques.php', data_to_send);
    if (res) {
      utils.toastAlert('success', 'تم تعديل السؤال بنجاح');
      setExam(
        exam.map(item => {
          return item.question_id == psItem.question_id
            ? {...item, question_valid_answer: newValue, loading: false}
            : item;
        }),
      );
    } else {
      setExam(
        exam.map(item => {
          return item.question_id == psItem.question_id
            ? {...item, loading: false}
            : item;
        }),
      );
    }
  }
  function renderHeader() {
    return (
      <Header
        title={psData?.exam_name}
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
      <>
        <ScrollView
          contentContainerStyle={{
            marginTop: SIZES.radius,
            paddingHorizontal: SIZES.padding,
            paddingBottom: SIZES.padding * 2,
          }}>
          {!passedExamData?.papel_link ? (
            <View
              style={{
                flex: 1,
              }}>
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                يجب إضافة ملف PDF أولاً
              </Text>
              <Button
                loading={uploadPdfLoading}
                disabled={uploadPdfLoading}
                onPress={() => {
                  _addPDF();
                }}
                mode="contained"
                buttonColor={COLORS.primary}>
                إضافة PDF
              </Button>
            </View>
          ) : (
            <View>
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                ملف PDF الخاص بالتاسك
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Button
                  //   loading={this.state.uploadPdfLoading}
                  style={{
                    width: '48%',
                  }}
                  loading={uploadPdfLoading}
                  disabled={uploadPdfLoading}
                  mode="contained"
                  buttonColor={COLORS.support4}
                  onPress={() => {
                    _addPDF();
                  }}
                  labelStyle={{
                    ...FONTS.h3,
                  }}>
                  تعديل
                </Button>
                <Button
                  onPress={() => {
                    setVisablePdfModal(true);
                  }}
                  style={{
                    width: '48%',
                  }}
                  mode="contained"
                  buttonColor={COLORS.primary}
                  labelStyle={{
                    ...FONTS.h3,
                  }}>
                  عرض
                </Button>
              </View>
            </View>
          )}

          <FlatList
            data={exam}
            contentContainerStyle={{
              marginTop: SIZES.padding,
              paddingBottom: SIZES.padding * 2,
            }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => (
              <View
                style={{
                  backgroundColor: COLORS.lightGray,
                  padding: 10,
                  borderRadius: 8,
                  marginVertical: 10,
                  width: '100%',
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    position: 'absolute',
                    backgroundColor: COLORS.lightGrey,
                    borderRadius: 8,
                    padding: 4,
                    paddingHorizontal: 8,
                    top: -10,
                  }}>
                  <Text
                    style={{
                      ...FONTS.h3,
                    }}>
                    •{++index}•
                  </Text>
                </View>
                {item?.loading ? (
                  <ActivityIndicator
                    size={24}
                    style={{
                      alignSelf: 'center',
                    }}
                    color={COLORS.primary}
                  />
                ) : (
                  <RadioButton.Group
                    onValueChange={newValue => {
                      modifyAnswer(newValue, item);
                    }}
                    value={item?.question_valid_answer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        // flexWrap: 'wrap',
                        // flex: 1,
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                        <RadioButton color={COLORS.primary} value="A" />
                        <Text style={{...FONTS.h3}}>A</Text>
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}>
                        <RadioButton color={COLORS.primary} value="B" />
                        <Text style={{...FONTS.h3}}>B</Text>
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}>
                        <RadioButton color={COLORS.primary} value="C" />
                        <Text style={{...FONTS.h3}}>C</Text>
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}>
                        <RadioButton color={COLORS.primary} value="D" />
                        <Text style={{...FONTS.h3}}>D</Text>
                      </View>
                    </View>
                  </RadioButton.Group>
                )}

                {/* </View> */}
                <Button
                  loading={item.delLoading}
                  disabled={item.delLoading || item.loading}
                  style={{
                    marginVertical: 8,
                  }}
                  buttonColor={COLORS.red}
                  mode="contained"
                  labelStyle={{
                    ...FONTS.h3,
                  }}
                  onPress={() => {
                    Alert.alert(
                      'تنبية ⚠️',
                      'تأكيد حذف السؤال',
                      [
                        {
                          text: 'إغلاق',
                          onPress: () => console.log('cancel mark whole exam'),
                        },
                        {
                          text: 'حذف',
                          style: 'cancel',
                          onPress: () => delete_question(item),
                        },
                      ],
                      {
                        cancelable: true,
                      },
                    );
                  }}>
                  حذف
                </Button>
              </View>
            )}
            ListFooterComponent={
              <Button
                loading={addQuesLoading}
                disabled={addQuesLoading}
                onPress={() => {
                  if (passedExamData?.papel_link) {
                    _addQuestion();
                  } else {
                    utils.toastAlert('info', 'برجاء إرفاق PDF أولاً');
                  }
                }}
                mode="contained"
                labelStyle={{
                  ...FONTS.h3,
                  color: COLORS.white,
                }}
                buttonColor={COLORS.primary}>
                إضافة سؤال
              </Button>
            }
          />
        </ScrollView>
      </>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      {renderHeader()}

      {pageLoading ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AnimatedLottieView
            source={lotties.loading_animation_blue}
            style={{
              width: RFValue(200),
              height: RFValue(200),
            }}
            resizeMode="contain"
          />
        </View>
      ) : (
        renderBody()
      )}
      <Modal
        visible={visablePdfModal}
        onRequestClose={() => {
          setVisablePdfModal(false);
        }}>
        <View style={{flex: 1}}>
          {/* Some Controls to change PDF resource */}

          <PDFView
            fadeInDuration={250.0}
            style={{flex: 1}}
            resource={passedExamData?.papel_link}
            resourceType={'url'}
            onLoad={() => setPdfLoading(false)}
            onError={error => {}}
          />
          {pdfLoading && (
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
          )}
        </View>
      </Modal>
    </View>
  );
};

export default ProfTaskQuestions;
