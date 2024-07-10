import React, {useState, useEffect, useContext} from 'react';
import {View, Text, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import {SIZES, FONTS, COLORS, icons, images, lotties} from '../../../constants';
import {Header, IconButton} from '../../../components';

import AnimatedLottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import MyLoader from '../../HomeLoader';
import {RFValue} from 'react-native-responsive-fontsize';
import * as Animatable from 'react-native-animatable';

const RenOption = ({title, index, onPress, lottieFile}) => {
  return (
    <Animatable.View
      key={index}
      delay={index * 100}
      animation="fadeInUp"
      useNativeDriver
      style={{
        backgroundColor: COLORS.primary + '20',
        padding: SIZES.base,
        borderRadius: SIZES.base,
        width: '48%',
        minHeight: RFValue(120),
        marginBottom: RFValue(15),
      }}>
      <TouchableOpacity onPress={onPress}>
        <Text
          style={{
            ...FONTS.h3,

            color: COLORS.dark,
          }}>
          {title}
        </Text>
        <AnimatedLottieView
          source={lottieFile}
          autoPlay
          loop
          style={{
            width: RFValue(70),
            height: RFValue(70),
            alignSelf: 'center',
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animatable.View>
  );
};
const SubjectProf = ({navigation, route}) => {
  const {profSub} = useSelector(s => s.ProfReducer);

  function renderHeader() {
    return (
      <Header
        title={profSub?.subject_name}
        containerStyle={{
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 25,
        }}
        leftComponent={
          <IconButton
            icon={icons.back}
            containerStyle={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              transform: [{rotate: '180deg'}],

              borderWidth: 1,
              borderRadius: SIZES.radius,
              borderColor: COLORS.gray2,
            }}
            iconStyle={{
              width: 20,
              height: 20,
              tintColor: COLORS.gray2,
            }}
            onPress={() => navigation.goBack()}
          />
        }
        rightComponent={<View style={{width: 40}} />}
      />
    );
  }

  function renderBoday() {
    return (
      <View
        style={{
          marginVertical: RFValue(10),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
          {/* <RenOption
            index={0}
            title="إمتحانات"
            onPress={() => {
              navigation.navigate('Exams');
            }}
            lottieFile={lotties.completing_tasks}
          /> */}
          <RenOption
            index={1}
            title="تاسكات"
            onPress={() => {
              navigation.navigate('ProfTasks');
            }}
            lottieFile={lotties.completing_tasks}
          />
          <RenOption
            index={2}
            title="فيديوهات"
            onPress={() => {
              navigation.navigate('ProfSubVideos');
            }}
            lottieFile={lotties.Play_Fill_Loader}
          />

          <RenOption
            index={3}
            title="ملخصات"
            onPress={() => {
              navigation.navigate('ProfSummary');
            }}
            lottieFile={lotties.pdf_symbol}
          />

          <RenOption
            index={4}
            title="إستفسارات"
            onPress={() => {
              navigation.navigate('ProfInquiry');
            }}
            lottieFile={lotties.info}
          />
          <RenOption
            index={5}
            title="لايف"
            onPress={() => {
              navigation.navigate('LiveLecture');
            }}
            lottieFile={lotties.live_webinar}
          />
        </View>
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {renderHeader()}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          paddingBottom: SIZES.radius,
        }}
        showsVerticalScrollIndicator={false}>
        {renderBoday()}
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Chat');
        }}
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          backgroundColor: COLORS.lightGray3,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 100,
          padding: 4,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,

          elevation: 5,
        }}>
        <AnimatedLottieView
          source={lotties.chat_icon}
          autoPlay
          loop
          style={{
            width: RFValue(50),
            height: RFValue(50),
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SubjectProf;
