import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {COLORS, SIZES} from '../../../constants';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
  ClientRole,
  ChannelProfile,
} from 'react-native-agora';
import requestCameraAndAudioPermission from './Permission';
import styles from './Style';
import {useSelector} from 'react-redux';

const LiveLecture = ({navigation}) => {
  const {userType} = useSelector(s => s.UserReducer);

  const _engine = useRef();
  const rtcProps = {
    token:
      '007eJxTYBDQVnGIi2D+rXldJaVYyZ5Vr3IbZ5D4kritMn6+Xcx7mxQYzJIsU9NMDC0TzZNMTAwskiwNDRINUkxTTVMTU4zTzNM6fk9KaQhkZOjOEWNkZIBAEJ+doSS1uCQnNZmBAQAW2BxM',
    appId: '6b9ef419a7b4408b910a0d5e5ead3f7f',
    channel: 'testlec',
  };

  const [isHost, setIsHost] = useState(true);
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);

  useEffect(() => {
    // console.log('userType', userType);
    setIsHost(userType == '1' ? false : true);
    if (Platform.OS === 'android') {
      // Request required permissions from Android
      requestCameraAndAudioPermission().then(() => {
        console.log('requested!');
      });
    }
    _engine.current = RtcEngine;
    _initLive();
    return () => _engine.current.destroy();
  }, []);

  async function _initLive() {
    _engine.current = await RtcEngine.create(rtcProps.appId);
    await _engine.current.enableVideo();
    await _engine.current?.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await _engine.current?.setClientRole(
      isHost ? ClientRole.Broadcaster : ClientRole.Audience,
    );

    _engine.current.addListener('Warning', warn => {
      console.log('Warning', warn);
    });

    _engine.current.addListener('Error', err => {
      console.log('Error', err);
    });

    _engine.current.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // Get current peer IDs
      const allPeers = [...peerIds];
      // If new user
      if (allPeers.indexOf(uid) === -1) {
        setPeerIds([...allPeers, uid]);
      }
    });

    _engine.current.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);

      // Remove peer ID from state array
      setPeerIds(peerIds.filter(id => id !== uid));
    });
    _engine.current.addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        // Set state variable to true
        setJoinSucceed(true);
      },
    );
  }

  async function toggleRoll() {
    // Join Channel using null token and channel name
    setIsHost(!isHost);
    await _engine.current?.setClientRole(
      isHost ? ClientRole.Broadcaster : ClientRole.Audience,
    );
  }

  async function startCall() {
    // Join Channel using null token and channel name
    await _engine.current?.joinChannel(
      rtcProps.token,
      rtcProps.channel,
      null,
      0,
    );
  }
  async function endCall() {
    await _engine.current?.leaveChannel();
    setPeerIds([]);
    setJoinSucceed(false);
  }

  function _renderRemoteVideos() {
    return (
      <ScrollView
        style={styles.remoteContainer}
        contentContainerStyle={styles.remoteContainerContent}
        horizontal={true}>
        {peerIds.map((value, index) => {
          return (
            <RtcRemoteView.SurfaceView
              key={index}
              style={styles.remote}
              uid={value}
              channelId={rtcProps.channel}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          );
        })}
      </ScrollView>
    );
  }

  function _renderVideos() {
    return joinSucceed ? (
      <View style={styles.fullView}>
        {isHost ? (
          <RtcLocalView.SurfaceView
            style={styles.max}
            channelId={rtcProps.channel}
            renderMode={VideoRenderMode.Hidden}
          />
        ) : (
          <>
            <RtcLocalView.SurfaceView
              style={styles.max}
              channelId={rtcProps.channel}
              renderMode={VideoRenderMode.Hidden}
            />
          </>
        )}
        {_renderRemoteVideos()}
      </View>
    ) : null;
  }

  return (
    <View style={styles.max}>
      <View style={styles.max}>
        {/* <Text style={styles.roleText}>
          You're {isHost ? 'a broadcaster' : 'the audience'}
        </Text> */}
        <View style={styles.buttonHolder}>
          {/* <TouchableOpacity onPress={toggleRoll} style={styles.button}>
            <Text style={styles.buttonText}> Toggle Role </Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={startCall} style={styles.button}>
            <Text style={styles.buttonText}> Start Call </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={endCall} style={styles.button}>
            <Text style={styles.buttonText}> End Call </Text>
          </TouchableOpacity>
        </View>
        {_renderVideos()}
      </View>
    </View>
  );
};
export default LiveLecture;
