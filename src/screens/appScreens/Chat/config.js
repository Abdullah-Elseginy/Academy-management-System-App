import React from 'react';
import {COLORS} from '../../../constants';

function getBubbleProps(theme) {
  return {
    wrapperStyle: {
      left: {
        marginBottom: 10,
        padding: 7,
        paddingBottom: 5,
        backgroundColor: COLORS.bg3,
        borderBottomRightRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 0,
      },
      right: {
        marginBottom: 10,
        padding: 7,
        paddingBottom: 5,
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 0,
      },
    },
    textStyle: {
      left: {
        color: COLORS.dark,
        marginBottom: 13,
        fontSize: 14.5,
      },
      right: {marginBottom: 10, fontSize: 14.5},
    },
  };
}

export {getBubbleProps};
