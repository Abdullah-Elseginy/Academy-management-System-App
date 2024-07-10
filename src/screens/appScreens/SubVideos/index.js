import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  StatusBar,
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
const SubVideos = ({navigation, route}) => {
  const {subjectData, netinfo} = useSelector(s => s.UserReducer);
  const [loadingPage, setLoadingPage] = useState(true);
  const [videos, setVideos] = useState([]);
  const [selectedVid, setSelectedVid] = useState({});
  const [visableVid, setVisableVid] = useState(false);

  useEffect(() => {
    getData();
  }, [netinfo]);

  async function getData() {
    let data_to_send = {
      subject_id: subjectData?.subject_id,
    };

    let res = await POST('select_videos.php', data_to_send);
    if (res && Array.isArray(res)) {
      setVideos(res);
    }
    setLoadingPage(false);
  }

  function get_video_url(item) {
    fetch(`https://player.vimeo.com/video/${item.video_player_id}/config`)
      .then(res => res.json())
      .then(res => {
        setSelectedVid({
          ...selectedVid,
          src: res.request.files.hls.cdns[res.request.files.hls.default_cdn]
            .url,
        });
      })
      .finally(() => {
        console.log(selectedVid);
      });
  }

  function renderHeader() {
    return (
      <Header
        title={subjectData?.subject_name}
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
          paddingBottom: SIZES.radius,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({index, item}) => (
          <Animatable.View
            delay={index * 50}
            useNativeDriver
            animation={'fadeInLeftBig'}>
            <TouchableOpacity
              onPress={() => {
                setSelectedVid(item);
                setVisableVid(true);
                // if (item.video_player_id != '') {
                //   get_video_url(item);
                // }
              }}
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
              </View>
              <FastImage
                source={images.main_logo}
                style={{
                  width: '100%',
                  height: RFValue(50),
                  alignSelf: 'center',
                }}
                resizeMode="center"
              />

              <View
                style={{
                  padding: SIZES.base,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
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

                <Text style={{...FONTS.h4, color: COLORS.dark}}>
                  {moment(item.video_date).fromNow()}
                </Text>
              </View>
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
      <StatusBar hidden={visableVid} />
      {renderBody()}

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
    </View>
  );
};

export default SubVideos;
