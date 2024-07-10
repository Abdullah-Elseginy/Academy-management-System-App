import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

import {COLORS, FONTS} from '../constants';

const TextButton = ({
  label,
  label2 = '',
  label2Style,
  labelStyle,
  buttonContainerStyle,
  onPress,
  disabled = false,
  loading,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        ...buttonContainerStyle,
      }}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator size={26} color={COLORS.white} />
      ) : (
        <>
          <Text
            style={{
              color: COLORS.white,
              ...FONTS.h3,
              ...labelStyle,
              fontFamily: FONTS.fontFamily,
            }}>
            {label}
          </Text>
          {label2 != '' && (
            <Text
              style={{
                flex: 1,
                textAlign: 'right',
                color: COLORS.white,
                ...FONTS.h3,
                ...label2Style,
                fontFamily: FONTS.fontFamily,
              }}>
              {label2}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default TextButton;
