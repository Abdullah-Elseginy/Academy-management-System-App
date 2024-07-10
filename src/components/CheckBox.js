import {is} from 'immer/dist/internal';
import React, {useState} from 'react';

import {View, Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {COLORS, FONTS, icons, SIZES} from '../constants';
const CheckBox = ({containerStyle, isSelected, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        ...containerStyle,
      }}>
      <View
        style={{
          width: 25,
          height: 25,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: SIZES.base,
          borderWidth: 3,
          borderColor: isSelected ? COLORS.primary : COLORS.gray,
          backgroundColor: isSelected ? COLORS.primary : null,
        }}>
        {isSelected && (
          <FastImage
            source={icons.checkmark}
            style={{
              width: 20,
              height: 20,
            }}
            tintColor={COLORS.light}
          />
        )}
      </View>
      <Text
        style={{
          flex: 1,
          marginLeft: SIZES.base,
          ...FONTS.body5,
          lineHeight: 20,
        }}>
        بمجرد إنشائك للحساب فأنت موافق على الشروط والاحكام الذى قرأتها فى منشور
        الصلاحيات
      </Text>
    </TouchableOpacity>
  );
};

export default CheckBox;
