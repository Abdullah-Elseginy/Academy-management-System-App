import React, {useEffect, useRef} from 'react';
import {View, Image, StatusBar} from 'react-native';
import {COLORS, FONTS, icons, images} from './src/constants';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import * as Animatable from 'react-native-animatable';
const SplashScreen = () => {
  const iconRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      iconRef.current.flipOutY(200);
    }, 2100);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: COLORS.white,
      }}>
      <StatusBar backgroundColor={COLORS.primary} />

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Animatable.Image
          ref={iconRef}
          delay={200}
          animation={'flipInY'}
          source={images.main_logo}
          style={{
            width: RFValue(190),
            height: RFValue(190),
            marginBottom: RFValue(80),
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default SplashScreen;
