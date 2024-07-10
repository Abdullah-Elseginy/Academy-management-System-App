import {Dimensions} from 'react-native';
import {Platform} from 'react-native';
const {width, height} = Dimensions.get('window');
import {isIphoneX} from 'react-native-iphone-x-helper';

export const IS_IOS = Platform.OS === 'ios';
export const IS_IPHONE_X = isIphoneX();
export const COLORS = {
  // base colors
  primary: '#3498DB',
  primaryDark: '#3498DB' + '20',
  primaryLite: '#3498DB' + '60',
  third: '#faca0c',
  secondary: '#3FD5B7',
  black: '#000000',
  green: '#60c5a8',
  darkBlue: '#111A2C',
  darkGray: '#525C67',
  darkGray2: '#757D85',
  bg: '#3d434c',
  bg2: '#373b43',
  bg3: '#464c59',
  gray: '#898B9A',
  gray2: '#BBBDC1',
  gray3: '#ECF0F3',
  lightGray: '#F5F5F6',
  lightGray2: '#F6F6F7',
  lightGray3: '#EFEFF1',
  lightGray4: '#F8F8F9',
  transparent: 'transparent',
  darkgray: '#898C95',
  white: '#FFFFFF',
  white2: '#FBFBFB',
  darkOverlayColor: 'rgba(0, 0, 0, 0.4)',
  darkOverlayColor2: 'rgba(0, 0, 0, 0.8)',
  primaryAlpha: 'rgba(99, 122, 255, 0.15)',
  greenAlpha: 'rgba(96, 197, 168, 0.15)',
  redAlpha: 'rgba(255, 84, 84, 0.15)',
  red: '#ff2f68',
  redAlpha: 'rgba(255, 84, 84, 0.15)',
  greenAlpha: 'rgba(96, 197, 168, 0.15)',
  purpleAlpha: 'rgba(146, 6, 228, 0.15)',

  // bags background colors
  bag1Bg: '#ea7a72',
  bag2Bg: '#c2c5d1',
  bag3Bg: '#82a7c9',
  bag4Bg: '#d49d8f',
  bag5Bg: '#ccd9c6',
  bag6Bg: '#767676',
  bag7Bg: '#d1c8c3',
  bag8Bg: '#dca47f',
  bag9Bg: '#eb849c',
  bag10Bg: '#979dc1',
  bag11Bg: '#c7d3c0',
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },

  // Error
  error: 'rgba(246, 86, 93, 1)',
  error80: 'rgba(246, 86, 93, 0.8)',
  error60: 'rgba(246, 86, 93, 0.6)',
  error20: 'rgba(246, 86, 93, 0.2)',
  error08: 'rgba(246, 86, 93, 0.08)',

  // Primary
  // primary: 'rgba(78, 85, 175, 1)',
  // primary80: 'rgba(78, 85, 175, 0.8)',
  // primary60: 'rgba(78, 85, 175, 0.6)',
  // primary20: 'rgba(78, 85, 175, 0.2)',
  // primary08: 'rgba(78, 85, 175, 0.08)',

  // Secondary
  secondary: 'rgba(161, 219, 245, 1)',
  secondary80: 'rgba(161, 219, 245, 0.8)',
  secondary60: 'rgba(161, 219, 245, 0.6)',
  secondary20: 'rgba(161, 219, 245, 0.2)',
  secondary08: 'rgba(161, 219, 245, 0.08)',

  // Success
  success: 'rgba(253, 212, 70, 1)',
  success80: 'rgba(253, 212, 70, 0.8)',
  success60: 'rgba(253, 212, 70, 0.6)',
  success20: 'rgba(253, 212, 70, 0.2)',
  success08: 'rgba(253, 212, 70, 0.08)',

  // Dark
  dark: 'rgba(13, 15, 35, 1)',
  dark80: 'rgba(13, 15, 35, 0.8)',
  dark60: 'rgba(13, 15, 35, 0.6)',
  dark20: 'rgba(13, 15, 35, 0.2)',
  dark08: 'rgba(13, 15, 35, 0.08)',

  // Grey
  grey: 'rgba(160, 161, 180, 1)',
  grey80: 'rgba(160, 161, 180, 0.8)',
  grey60: 'rgba(160, 161, 180, 0.6)',
  grey20: 'rgba(160, 161, 180, 0.2)',
  grey08: 'rgba(160, 161, 180, 0.08)',

  // Light Grey
  lightGrey: 'rgba(247, 247, 247, 1)',
  lightGrey80: 'rgba(247, 247, 247, 0.8)',
  lightGrey60: 'rgba(247, 247, 247, 0.6)',
  lightGrey20: 'rgba(247, 247, 247, 0.2)',
  lightGrey08: 'rgba(247, 247, 247, 0.08)',

  // Light
  light: 'rgba(255, 255, 255, 1)',
  light80: 'rgba(255, 255, 255, 0.8)',
  light60: 'rgba(255, 255, 255, 0.6)',
  light20: 'rgba(255, 255, 255, 0.2)',
  light08: 'rgba(255, 255, 255, 0.08)',

  // Support 1
  support1: 'rgba(110, 162, 255, 1)',
  support1_08: 'rgba(110, 162, 255, 0.08)',

  // Support 2
  support2: 'rgba(249, 161, 218, 1)',
  support2_08: 'rgba(249, 161, 218, 0.08)',

  // Support 3
  support3: 'rgba(0, 210, 224, 1)',
  support3_08: 'rgba(0, 210, 224, 0.08)',

  // Support 4
  support4: 'rgba(255, 132, 13, 1)',
  support4_08: 'rgba(255, 132, 13, 0.08)',

  // Support 5
  support5: 'rgba(123, 96, 238, 1)',
  support5_08: 'rgba(123, 96, 238, 0.08)',

  // Shadow
  shadow: 'rgba(138, 149, 158, 1)',
  shadow08: 'rgba(138, 149, 158, 0.08)',
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  margin: 20,

  // font sizes
  largeTitle: 40,
  h1: 30,
  h2: 22,
  h3: 16,
  h4: 14,
  h5: 12,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
  width,
  height,
};

export const FONTS = {
  h1: {
    fontFamily: 'LamaSans-Medium',
    fontSize: SIZES.h1,
  },
  body3: {fontFamily: 'LamaSans-Medium', fontSize: SIZES.body3},
  h2: {
    fontFamily: 'LamaSans-Medium',
    fontSize: SIZES.h2,
    // lineHeight: 30,
  },
  h3: {
    fontFamily: 'LamaSans-Medium',
    fontSize: SIZES.h3,
    // lineHeight: 22,
  },
  h4: {
    fontFamily: 'LamaSans-Medium',
    fontSize: SIZES.h4,
    // lineHeight: 22,
  },
  h5: {
    fontFamily: 'LamaSans-Medium',
    fontSize: SIZES.h5,
    // lineHeight: 22,
  },
  body1: {
    fontFamily: 'LamaSans-Medium',
    fontSize: SIZES.body1,
    // lineHeight: 36,
  },
  body2: {
    fontFamily: 'LamaSans-Medium',
    fontSize: SIZES.body2,
    // lineHeight: 30,
  },
  body3: {
    fontFamily: 'LamaSans-Medium',
    fontSize: SIZES.body3,
    // lineHeight: 22,
  },
  body4: {
    fontFamily: 'LamaSans-Medium',
    fontSize: SIZES.body4,

    // lineHeight: 22,
  },
  body5: {
    fontFamily: 'LamaSans-Medium',
    fontSize: SIZES.body5,
    // lineHeight: 22,
  },

  fontFamily: 'LamaSans-Medium',
};

const appTheme = {COLORS, SIZES, FONTS, IS_IOS, IS_IPHONE_X};

export default appTheme;
