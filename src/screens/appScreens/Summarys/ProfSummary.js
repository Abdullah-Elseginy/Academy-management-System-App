import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  TextInput,
  Alert,
} from 'react-native';
import {ActivityIndicator, Button, Portal, Provider} from 'react-native-paper';
import {
  AppData,
  COLORS,
  FONTS,
  icons,
  images,
  lotties,
  SIZES,
} from '../../../constants';
import {RFValue} from 'react-native-responsive-fontsize';
import {Header, IconButton} from '../../../components';
import AnimatedLottieView from 'lottie-react-native';
import PDFView from 'react-native-view-pdf';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import {useSelector} from 'react-redux';
import MyLoader from './Loader';
import {POST} from '../../../Helpers/ApiHelper';
import Feather from 'react-native-vector-icons/Feather';
import DocumentPicker from 'react-native-document-picker';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-simple-toast';
import utils from '../../../utils';

const ProfSummary = ({navigation}) => {
  const {netinfo} = useSelector(s => s.UserReducer);
  const {profSub} = useSelector(s => s.ProfReducer);

  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [visablePreView, setVisablePreView] = useState(false);
  const [visablePDFModal, setVisablePDFModal] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [visableAddPdfModal, setVisableAddPdfModal] = useState(false);

  const [addSummaryLoading, setAddSummaryLoading] = useState(false);
  const [summaryName, setSummaryName] = useState('');
  const [summaryFile, setSummaryFile] = useState(null);

  useEffect(() => {
    getData();
  }, [netinfo]);
  async function getData() {
    let data_to_send = {
      subject_id: profSub?.subject_id,
    };

    let res = await POST('select_summary.php', data_to_send);
    if (res && Array.isArray(res)) {
      setData(
        res.map(item => {
          return {...item, delLoading: false};
        }),
      );
    }
    setLoadingPage(false);
  }
  async function downloadPdf() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ToastAndroid.showWithGravity(
          '1 item will be downloaded. see notification for details',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
        setIsDownloading(true);
        var file_url = selectedItem?.summary_link;
        const {
          dirs: {DownloadDir, DocumentDir},
        } = RNFetchBlob.fs;
        const {config} = RNFetchBlob;
        const isIos = Platform.OS === 'ios';
        const aPath = Platform.select({ios: DocumentDir, android: DownloadDir});
        var ext = 'pdf';
        var file_ex = selectedItem?.summary_name;
        const fPath = `${aPath}/${file_ex}`;
        const configOption = Platform.select({
          ios: {
            fileCache: true,
            path: fPath,
            appendExt: ext,
          },
          android: {
            fileCache: false,
            appendExt: ext,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              path: aPath + '/' + file_ex + '.pdf',
              description: selectedItem?.summary_name + '.pdf',
            },
          },
        });
        if (isIos) {
          let allData = this.state.arr;
          allData[index].downloadProgress = true;
          this.setState({
            arr: allData,
          });
          // this.setState({loading: true, progress: 0});
          RNFetchBlob.config(configOption)
            .fetch('GET', file_url)
            .then(res => {
              let allData = this.state.arr;
              allData[index].downloadProgress = false;
              this.setState({
                arr: allData,
              });

              RNFetchBlob.ios.previewDocument('file://' + res.path());
            });
          this.setState({
            downloading_file: false,
          });
          return;
        } else {
          config(configOption)
            .fetch('GET', file_url)
            .progress((received, total) => {})
            .then(res => {
              RNFetchBlob.android.actionViewIntent('file://' + res.path());
              setIsDownloading(false);
            })
            .catch((errorMessage, statusCode) => {
              setIsDownloading(false);
            });
        }
      } else {
        console.log('Permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async function _choiseFile() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      setSummaryName(res.name);
      setSummaryFile(res);
    } catch (err) {}
  }

  async function _CheckAddPdf() {
    if (!summaryFile) {
      Toast.showWithGravity(
        'برجاء إختيار ملف أولاً',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    setAddSummaryLoading(true);
    const data = new FormData();
    data.append('file_attachment', summaryFile);
    data.append('summery_name', summaryName.trim());
    data.append('summary_subject_id', profSub?.subject_id);

    let res = await fetch(AppData.domain + 'doctor/upload_summary.php', {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data; ',
      },
    });
    let responseJson = await res.json();

    if (responseJson.status == 'success') {
      setVisableAddPdfModal(false);
      setSummaryFile(null);
      setSummaryName('');
      utils.toastAlert('success', 'تم الرفع بنجاح');

      getData();
    } else {
      utils.toastAlert(
        'error',
        responseJson.message || 'حدث خطأ ما برجاء المحاولة لاحقا',
      );
    }
    setAddSummaryLoading(false);
  }

  async function _deleteSummary(psItem) {
    setData(
      data.map(item => {
        return psItem?.summary_id == item?.summary_id
          ? {...item, delLoading: true}
          : item;
      }),
    );

    let data_to_send = {
      summary_id: psItem?.summary_id,
    };
    let res = await POST('doctor/delete_summary.php', data_to_send);
    if (res) {
      utils.toastAlert('success', 'تم حذف الملخص بنجاح');
      setData(data.filter(item => item.summary_id != psItem?.summary_id));
    } else {
      setData(
        data.map(item => {
          return psItem?.summary_id == item?.summary_id
            ? {...item, delLoading: false}
            : item;
        }),
      );
    }
  }

  function renderHeader() {
    return (
      <Header
        title={'ملخصات'}
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
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          paddingBottom: SIZES.padding * 2 + RFValue(40),
        }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity
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
              flexDirection: 'row',
              alignItems: 'center',
              // justifyContent: 'center',
              borderLeftColor: COLORS.primary,
              borderLeftWidth: 6,
            }}
            onLongPress={() => {
              Alert.alert(
                'تأكيد حذف',
                `تأكيد حذف الملخص ⚠️`,
                [
                  {
                    text: 'حذف',
                    onPress: () => _deleteSummary(item),
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
            onPress={() => {
              setSelectedItem(item);
              // setVisablePreView(true);
              setVisablePDFModal(true);
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
                {item?.summary_name}
              </Text>
            </View>
            {item?.delLoading ? (
              <ActivityIndicator color={COLORS.red} size={24} />
            ) : (
              <AnimatedLottieView
                autoPlay
                loop
                source={lotties.pdf_symbol}
                style={{
                  width: RFValue(30),
                  height: RFValue(30),
                }}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
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
      {/* Modals */}
      {!loadingPage && (
        <TouchableOpacity
          onPress={() => {
            setVisableAddPdfModal(true);
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
      {/* Modal PreView */}
      <Modal
        transparent
        visible={visablePreView}
        onRequestClose={() => {
          setVisablePreView(false);
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.darkOverlayColor,
          }}>
          <TouchableOpacity
            style={{...StyleSheet.absoluteFill}}
            onPress={() => {
              setVisablePreView(false);
            }}></TouchableOpacity>

          <View
            style={{
              backgroundColor: COLORS.white,
              padding: SIZES.padding,
              borderRadius: SIZES.radius,
              width: '90%',
            }}>
            <Text
              style={{...FONTS.h3, color: COLORS.black, textAlign: 'center'}}>
              {selectedItem?.title}
            </Text>
            <Text
              style={{...FONTS.h3, color: COLORS.black, textAlign: 'center'}}>
              {selectedItem?.desc}
            </Text>
            <Button
              onPress={() => {
                setVisablePreView(false);
                setVisablePDFModal(true);
              }}
              mode="contained"
              icon={'file-png-box'}
              buttonColor={COLORS.primary}
              labelStyle={{
                ...FONTS.h3,
                color: COLORS.white,
              }}>
              عرض الملف
            </Button>
          </View>
        </View>
      </Modal>

      {/* PDF MODAL */}
      <Modal
        visible={visablePDFModal}
        onRequestClose={() => {
          setVisablePDFModal(false);
          setPdfLoading(true);
        }}>
        <View
          style={{
            backgroundColor: COLORS.primary,
            width: '100%',
            padding: '5%',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text style={{...FONTS.h3, color: COLORS.white}}>
            {selectedItem?.summary_name}
          </Text>
          {isDownloading ? (
            <ActivityIndicator size={24} color={COLORS.white} />
          ) : (
            <TouchableOpacity onPress={() => downloadPdf()}>
              <MaterialCommunityIcons
                name="download-circle"
                color={COLORS.white}
                size={RFValue(30)}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={{flex: 1}}>
          <PDFView
            fadeInDuration={250.0}
            style={{flex: 1}}
            resource={selectedItem?.summary_link}
            resourceType="url"
            onLoad={() => {
              setPdfLoading(false);
            }}
            onError={error => console.log('Cannot render PDF', error)}
          />
          {pdfLoading ? (
            <View style={{...styles.LoadingScreen}}>
              <AnimatedLottieView
                source={lotties.loading_animation_blue}
                autoPlay
                loop
                style={{width: '100%'}}
              />
            </View>
          ) : null}
        </View>
      </Modal>

      <Modal
        visible={visableAddPdfModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setVisableAddPdfModal(false);
          setSummaryFile(null);
          setSummaryName('');
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.darkOverlayColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={{...StyleSheet.absoluteFill}}
            onPress={() => {
              setVisableAddPdfModal(false);
              setSummaryFile(null);
              setSummaryName('');
            }}></TouchableOpacity>
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: SIZES.radius,
              padding: SIZES.padding,
              width: '90%',
              height: '50%',
            }}>
            <KeyboardAwareScrollView
              enableOnAndroid={true}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              extraScrollHeight={-300}
              showsVerticalScrollIndicator={false}>
              <Button
                onPress={_choiseFile}
                mode="contained"
                buttonColor={COLORS.primary}
                labelStyle={{
                  ...FONTS.h3,
                  color: COLORS.white,
                }}
                style={{
                  borderRadius: SIZES.base,
                }}>
                إختر الملف
              </Button>
              {summaryFile && (
                <>
                  <Text
                    style={{
                      ...FONTS.h3,
                      color: COLORS.black,
                      marginVertical: RFValue(10),
                    }}>
                    إسم الملف (أدخل إسم الملف الذى سوف يظهر للطلاب )
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
                    placeholder="أدخل إسم الملف الفيديو"
                    value={summaryName}
                    onChangeText={val => setSummaryName(val)}
                  />
                </>
              )}
            </KeyboardAwareScrollView>
            <Button
              onPress={_CheckAddPdf}
              loading={addSummaryLoading}
              disabled={addSummaryLoading}
              mode="contained"
              buttonColor={COLORS.primary}
              labelStyle={{
                ...FONTS.h3,
                color: COLORS.white,
              }}
              style={{
                borderRadius: SIZES.base,
              }}>
              إضافة
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

export default ProfSummary;
