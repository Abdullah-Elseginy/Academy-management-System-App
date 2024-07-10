import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';

import {COLORS, FONTS, icons, images, SIZES} from '../../../constants';
import {RFValue} from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';

const BatchItem = ({item, index, onPress}) => {
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
          <FastImage
            source={icons.batch_study}
            style={{
              width: RFValue(25),
              height: RFValue(25),
            }}
            tintColor={COLORS.primary}
            resizeMode="contain"
          />
        </View>
        <View
          style={{
            flex: 1,
          }}>
          <View>
            <Text
              style={{
                ...FONTS.h3,
                color: COLORS.black,
              }}>
              {item?.generation_name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default BatchItem;
