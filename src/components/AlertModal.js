import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {lotties, FONTS, COLORS} from '../constants';
import {Button} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch} from 'react-redux';
import {modifyAlertModal} from '../redux/reducers/UserReducer';
const AlertModal = ({visableAlertModal, message, res}) => {
  const dispacth = useDispatch();
  const closeModal = () => {
    dispacth(modifyAlertModal({show: false, message: null, res: null}));
  };
  return (
    <Modal
      visible={visableAlertModal}
      transparent={true}
      onRequestClose={() => {
        closeModal();
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{...StyleSheet.absoluteFillObject}}
          onPress={() => {
            closeModal();
          }}></TouchableOpacity>
        <View
          style={{
            width: 350,
            // height: 250,
            borderRadius: 10,
            backgroundColor: '#fff',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'space-around',
          }}>
          <LottieView
            source={res == 'succ' ? lotties.done : lotties.error}
            autoPlay
            loop
            style={{height: 100, width: '100%'}}
            resizeMode="contain"
          />
          <Text
            style={{
              fontSize: 20,
              fontFamily: FONTS.fontFamily,
            }}>
            {message}
          </Text>
          <Button
            mode="contained"
            buttonColor={res == 'succ' ? COLORS.primary : COLORS.red}
            onPress={() => {
              closeModal();
            }}
            style={{
              marginTop: RFValue(10),
              width: '90%',
              //   backgroundColor: res == 'succ' ? COLORS.primary : COLORS.red,
            }}
            labelStyle={{
              fontFamily: FONTS.fontFamily,
              color: '#000',
            }}>
            إغلاق
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;
