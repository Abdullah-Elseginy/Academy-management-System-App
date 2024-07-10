import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {COLORS, FONTS, icons, images, SIZES} from '../../../constants';
import {RFValue} from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import moment from 'moment/moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
const NotificationItem = ({item, index, onPress}) => {
  return (
    <Animatable.View
      animation="fadeInRight"
      key={index}
      delay={index * 50}
      useNativeDriver
      style={{
        backgroundColor: COLORS.white,
        marginTop: SIZES.base,
        // paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.base,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        // minHeight: RFValue(40),
      }}>
      <TouchableOpacity
        onPress={() => {
          onPress(item);
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            marginRight: 10,
          }}>
          <Ionicons
            name="notifications"
            color={COLORS.primary}
            size={RFValue(25)}
          />
        </View>
        <View
          style={{
            flex: 1,
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{...FONTS.h4, color: COLORS.dark}}>
                {item?.notification_title}
              </Text>
              <Text
                style={{
                  ...FONTS.h5,
                }}>
                {moment(item?.notification_date).fromNow()}
              </Text>
            </View>

            <Text
              style={{
                ...FONTS.h5,
                color: COLORS.gray,
              }}>
              {item?.notification_body}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <Text
        style={{
          ...FONTS.h6,
          color: COLORS.gray,
          alignSelf: 'flex-start',
        }}>
        ~{item?.subject_name}~
      </Text>
    </Animatable.View>
  );
};

export default NotificationItem;
