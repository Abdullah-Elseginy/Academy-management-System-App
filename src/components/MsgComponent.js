import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import {COLORS, FONTS} from '../constants';
import TimeDelivery from './TimeDelivery';
const MsgComponent = props => {
  const {sender, massage, item, sendTime, index} = props;

  return (
    <TouchableOpacity
      onLongPress={() => {
        Clipboard.setString(item.message);
        Toast.showWithGravity('تم نسخ النص', Toast.SHORT, Toast.BOTTOM);
      }}
      style={{marginVertical: 0}}>
      <View
        style={[styles.TriangleShapeCSS, sender ? styles.right : [styles.left]]}
      />
      <View
        style={[
          styles.masBox,
          {
            alignSelf: sender ? 'flex-end' : 'flex-start',
            backgroundColor: sender ? COLORS.primary : COLORS.white,
          },
        ]}>
        <Text
          style={{
            paddingLeft: 5,
            color: sender ? COLORS.white : COLORS.black,
            fontFamily: FONTS.fontFamily,
            fontSize: 12.5,
          }}>
          {item.message}
        </Text>

        <TimeDelivery sender={sender} item={item} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  masBox: {
    alignSelf: 'flex-end',
    marginHorizontal: 10,
    minWidth: 80,
    maxWidth: '80%',
    paddingHorizontal: 10,
    marginVertical: 5,
    paddingTop: 5,
    borderRadius: 8,
  },
  timeText: {
    fontFamily: 'AveriaSerifLibre-Light',
    fontSize: 10,
  },
  dayview: {
    alignSelf: 'center',
    height: 30,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: COLORS.white,
    borderRadius: 30,
    marginTop: 10,
  },
  iconView: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: COLORS.themecolor,
  },
  TriangleShapeCSS: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 5,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  left: {
    borderBottomColor: COLORS.white,
    left: 2,
    bottom: 10,
    transform: [{rotate: '0deg'}],
  },
  right: {
    borderBottomColor: COLORS.primary,
    right: 8,
    bottom: 5,
    transform: [{rotate: '103deg'}],
  },
});

export default MsgComponent;
