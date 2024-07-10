import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  StatusBar,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {SIZES, FONTS, COLORS, icons, images, lotties} from '../../../constants';
import {Header, IconButton} from '../../../components';
import AnimatedLottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import Orientation from 'react-native-orientation';
import {RFValue} from 'react-native-responsive-fontsize';
import * as Animatable from 'react-native-animatable';
import Video from 'react-native-af-video-player-updated';
import moment from 'moment/moment';
import FastImage from 'react-native-fast-image';
import MyLoader from './Loader';
import {POST} from '../../../Helpers/ApiHelper';
import {Button} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-simple-toast';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import utils from '../../../utils';

const ProfSubVideos = ({navigation, route}) => {
  const {netinfo} = useSelector(s => s.UserReducer);
  const {profSub} = useSelector(s => s.ProfReducer);

  const [loadingPage, setLoadingPage] = useState(true);
  const [videos, setVideos] = useState([]);
  const [selectedVid, setSelectedVid] = useState({});
  const [visableVid, setVisableVid] = useState(false);

  const [addVideoLoading, setAddVideoLoading] = useState(false);
  const [editVideoLoading, setEditVideoLoading] = useState(false);

  const [visableAddVideoModal, setVisableAddVideoModal] = useState(false);
  const [visableEditModal, setVisableEditModal] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoLink, setVideoLink] = useState('');

  useEffect(() => {
    getData();
  }, []);

  async function _CheckAddVideo() {
    if (videoTitle == '') {
      Toast.showWithGravity(
        'برجاء كتابة عنوان الفيديو',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }

    if (videoDescription == '') {
      Toast.showWithGravity(
        'برجاء كتابة وصف الفديو',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    if (videoLink == '') {
      Toast.showWithGravity(
        'برجاء كتابة رابط الفيديو',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }

    setAddVideoLoading(true);
    let data_to_send = {
      video_title: videoTitle.trim(),
      description: videoDescription.trim(),
      video_link: videoLink.trim(),
      subject_id: profSub?.subject_id,
    };
    let res = await POST('doctor/add_video.php', data_to_send);
    if (res) {
      onCloseAddVideo();

      utils.toastAlert('success', 'تم إضافة الفديو بنجاح');
      getData();
    }
    setAddVideoLoading(false);
  }
  async function _CheckEditVideo() {
    if (selectedVid?.video_title == '') {
      Toast.showWithGravity(
        'برجاء كتابة عنوان الفيديو',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }

    if (selectedVid?.video_description == '') {
      Toast.showWithGravity(
        'برجاء كتابة وصف الفديو',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }
    if (selectedVid?.video_link == '') {
      Toast.showWithGravity(
        'برجاء كتابة رابط الفيديو',
        Toast.SHORT,
        Toast.BOTTOM,
      );
      return;
    }

    setEditVideoLoading(true);
    let data_to_send = {
      video_title: selectedVid?.video_title,
      video_description: selectedVid?.video_description,
      video_link: selectedVid?.video_link,
      video_id: selectedVid?.video_id,
    };
    let res = await POST('doctor/edit_video_data.php', data_to_send);
    if (res) {
      onCloseEditVideo();

      utils.toastAlert('success', 'تم تعديل الفديو بنجاح');
      getData();
    } else {
      Toast.showWithGravity('حدث خطأ ما', Toast.SHORT, Toast.BOTTOM);
    }
    setEditVideoLoading(false);
  }

  function onCloseAddVideo() {
    setVisableAddVideoModal(false);
    setVideoDescription('');
    setVideoLink('');
    setVideoTitle('');
  }

  function onCloseEditVideo() {
    setVisableEditModal(false);
    setSelectedVid({});
  }

  async function getData() {
    let data_to_send = {
      subject_id: profSub?.subject_id,
    };

    let res = await POST('doctor/select_videos.php', data_to_send);
    if (res && Array.isArray(res)) {
      setVideos(
        res.map(item => {
          return {...item, showLoading: false, delLoading: false};
        }),
      );
    }
    setLoadingPage(false);
  }

  function get_video_url(item) {
    fetch(`https://player.vimeo.com/video/${item.video_player_link}/config`)
      .then(res => res.json())
      .then(res => {
        console.log(
          'new link',
          res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
        );
        setSelectedVid({
          ...selectedVid,
          src: res.request.files.hls.cdns[res.request.files.hls.default_cdn]
            .url,
        });
      })
      .finally(() => {
        console.log('selectedVid', selectedVid);
      });
  }
  async function _modifyShowItem(psItem) {
    setVideos(
      videos.map(item => {
        return psItem?.video_id == item?.video_id
          ? {...item, showLoading: true}
          : item;
      }),
    );

    let data_to_send = {
      video_id: psItem?.video_id,
      value: psItem?.hide == '1' ? '0' : '1',
    };
    let res = await POST('doctor/show_video.php', data_to_send);
    if (res) {
      utils.toastAlert(
        'success',
        psItem?.hide == '1'
          ? 'تم إخفاء الفيديو بنجاح'
          : 'تم إظهار الفيديو بنجاح',
      );

      let allData = [...videos];
      let indexOfItem = allData.findIndex(
        item => item.video_id == psItem?.video_id,
      );
      allData[indexOfItem].hide = psItem?.hide == '1' ? '0' : '1';
      setVideos(allData);
    }
    setVideos(
      videos.map(item => {
        return psItem?.video_id == item?.video_id
          ? {...item, showLoading: false}
          : item;
      }),
    );
  }

  async function _deleteVideo(psItem) {
    setVideos(
      videos.map(item => {
        return psItem?.video_id == item?.video_id
          ? {...item, delLoading: true}
          : item;
      }),
    );

    let data_to_send = {
      video_id: psItem?.video_id,
    };
    let res = await POST('doctor/delete_video.php', data_to_send);
    if (res) {
      utils.toastAlert('success', 'تم حذف الفيديو بنجاح');
      setVideos(videos.filter(item => item?.video_id != psItem?.video_id));
      // let allData = [...videos];
      // let indexOfItem = allData.findIndex(
      //   item => item.video_id == psItem?.video_id,
      // );
      // allData.splice(indexOfItem, 1);
      // setVideos(allData);
    } else {
      setVideos(
        videos.map(item => {
          return psItem?.video_id == item?.video_id
            ? {...item, delLoading: false}
            : item;
        }),
      );
    }
  }
  function renderHeader() {
    return (
      <Header
        title={profSub?.subject_name}
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
        data={videos}
        contentContainerStyle={{
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          paddingBottom: SIZES.radius + RFValue(40),
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({index, item}) => (
          <Animatable.View
            delay={index * 50}
            useNativeDriver
            animation={'fadeInLeftBig'}>
            <View
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
                marginVertical: RFValue(5),
              }}>
              <View
                style={{
                  padding: SIZES.base,
                }}>
                <Text style={{...FONTS.h4, color: COLORS.dark}}>
                  {item.video_title}
                </Text>
                <Text
                  style={{...FONTS.h5, color: COLORS.gray}}
                  numberOfLines={3}>
                  {item.video_description}
                </Text>

                <Text style={{...FONTS.h4, color: COLORS.dark}}>
                  {moment(item.video_date).fromNow()}
                </Text>
              </View>
              {/* <FastImage
                source={images.main_logo}
                style={{
                  width: '100%',
                  height: RFValue(50),
                  alignSelf: 'center',
                }}
                resizeMode="center"
              /> */}

              <View
                style={{
                  padding: SIZES.base,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}>
                {/* <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Ionicons
                    name="eye"
                    size={24}
                    color={COLORS.dark}
                    style={{marginRight: 4}}
                  />
                  <Text style={{...FONTS.h4, color: COLORS.dark}}>
                    {item.views}
                  </Text>
                </View> */}

                <Button
                  onPress={() => {
                    setSelectedVid(item);
                    setVisableVid(true);
                    // if (item.video_player_id != '') {
                    //   get_video_url(item);
                    // }
                  }}
                  buttonColor={COLORS.primary}
                  style={{
                    borderRadius: 8,
                    width: '30%',
                  }}
                  labelStyle={{
                    ...FONTS.h3,
                    color: COLORS.white,
                  }}>
                  مشاهدة
                </Button>
                <Button
                  onPress={() => {
                    setSelectedVid(item);
                    setVisableEditModal(true);
                  }}
                  buttonColor={COLORS.green}
                  style={{
                    borderRadius: 8,
                    marginVertical: RFValue(4),
                    width: '30%',
                  }}
                  labelStyle={{
                    ...FONTS.h3,
                    color: COLORS.white,
                  }}>
                  تعديل
                </Button>
                <Button
                  loading={item.showLoading}
                  disabled={item.showLoading}
                  onPress={() => {
                    _modifyShowItem(item);
                  }}
                  buttonColor={COLORS.support4}
                  style={{
                    borderRadius: 8,
                    marginBottom: RFValue(4),
                    // width: '30%',
                  }}
                  labelStyle={{
                    ...FONTS.h3,
                    color: COLORS.white,
                  }}>
                  {item?.hide == '1' ? 'عرض' : 'إخفاء'} الفيديو
                </Button>
                <Button
                  loading={item.delLoading}
                  // disabled={item.delLoading}
                  onPress={() => {
                    Alert.alert(
                      'تأكيد حذف',
                      `تأكيد حذف الفيديو ⚠️`,
                      [
                        {
                          text: 'حذف',
                          onPress: () => _deleteVideo(item),
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
                  buttonColor={COLORS.red}
                  style={{
                    borderRadius: 8,
                    width: '30%',
                  }}
                  labelStyle={{
                    ...FONTS.h3,
                    color: COLORS.white,
                  }}>
                  حذف
                </Button>
              </View>
            </View>
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
      <StatusBar hidden={visableVid} />
      {renderBody()}
      {!loadingPage && (
        <TouchableOpacity
          onPress={() => {
            setVisableAddVideoModal(true);
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

      <Modal
        visible={visableVid}
        animationType={'slide'}
        onRequestClose={() => {
          setVisableVid(false);
          Orientation.lockToPortrait();
        }}>
        <View
          style={{
            flex: 1,
            // alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.dark,
          }}>
          {selectedVid?.src != '' ? (
            <Video
              pause={false}
              url={selectedVid?.video_link}
              title={selectedVid?.video_title}
              logo={images.main_logo}
              inlineOnly={false}
              hideFullScreenControl={false}
              rotateToFullScreen
              // onProgress={() => {
              //   alert(index);
              // }}
            />
          ) : (
            <AnimatedLottieView
              source={lotties.loading_animation_blue}
              autoPlay
              loop
              style={{width: '100%'}}
            />
          )}
        </View>
      </Modal>
      {/* Add MOdal */}
      <Modal
        visible={visableAddVideoModal}
        transparent
        animationType="fade"
        onRequestClose={onCloseAddVideo}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.darkOverlayColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={{...StyleSheet.absoluteFill}}
            onPress={onCloseAddVideo}></TouchableOpacity>
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
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                عنوان الفيديو
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
                placeholder="أدخل عنوان الفيديو"
                value={videoTitle}
                onChangeText={val => setVideoTitle(val)}
              />
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                وصف الفيديو
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
                multiline={true}
                placeholder="أدخل وصف الفيديو"
                value={videoDescription}
                onChangeText={val => setVideoDescription(val)}
              />
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                رابط الفيديو
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
                placeholder="أدخل رابط الفيديو"
                value={videoLink}
                onChangeText={val => setVideoLink(val)}
              />
            </KeyboardAwareScrollView>
            <Button
              onPress={_CheckAddVideo}
              loading={addVideoLoading}
              disabled={addVideoLoading}
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
      {/* Edit Modal */}
      <Modal
        visible={visableEditModal}
        transparent
        animationType="fade"
        onRequestClose={onCloseEditVideo}>
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.darkOverlayColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={{...StyleSheet.absoluteFill}}
            onPress={onCloseEditVideo}></TouchableOpacity>
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
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                عنوان الفيديو
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
                placeholder="أدخل عنوان الفيديو"
                value={selectedVid?.video_title}
                onChangeText={val =>
                  setSelectedVid({...selectedVid, video_title: val})
                }
              />
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                وصف الفيديو
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
                multiline={true}
                placeholder="أدخل وصف الفيديو"
                value={selectedVid?.video_description}
                onChangeText={val =>
                  setSelectedVid({...selectedVid, video_description: val})
                }
              />
              <Text
                style={{
                  ...FONTS.h3,
                  color: COLORS.black,
                }}>
                رابط الفيديو
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
                placeholder="أدخل رابط الفيديو"
                value={selectedVid?.video_link}
                onChangeText={val =>
                  setSelectedVid({...selectedVid, video_link: val})
                }
              />
            </KeyboardAwareScrollView>
            <Button
              onPress={_CheckEditVideo}
              loading={editVideoLoading}
              disabled={editVideoLoading}
              mode="contained"
              buttonColor={COLORS.primary}
              labelStyle={{
                ...FONTS.h3,
                color: COLORS.white,
              }}
              style={{
                borderRadius: SIZES.base,
              }}>
              تعديل
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfSubVideos;
