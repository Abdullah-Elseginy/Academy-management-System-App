import {View, Text, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {FormInput, Header, TextIconButton} from '../../../components';
import {COLORS, FONTS, icons, images, SIZES} from '../../../constants';
import {useDispatch, useSelector} from 'react-redux';
import Auth from '../../../Services';
import {removeUser} from '../../../redux/reducers/UserReducer';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {POST} from '../../../Helpers/ApiHelper';
import {removeParent} from '../../../redux/reducers/ParentReducer';

const ParentSettings = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector(s => s.UserReducer);
  const {parentData} = useSelector(s => s.ParentReducer);

  const [isEditableMode, setIsEditableMode] = useState(false);
  const [reqLoading, setReqLoading] = useState(false);

  async function _logoutStudent() {
    setReqLoading(true);

    dispatch(removeUser());
    dispatch(removeParent());

    await Auth.logout();
    setReqLoading(false);
  }
  function renderHeader() {
    return (
      <Header
        title={'الإعدادات'}
        containerStyle={{
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 25,
        }}
        // rightComponent={
        //   <View style={{alignItems: 'center', justifyContent: 'center'}}>
        //     <IconButton
        //       icon={icons.logout}
        //       containerStyle={{
        //         width: 40,
        //         transform: [{rotate: '180deg'}],
        //         height: 40,
        //         justifyContent: 'center',
        //         alignItems: 'center',
        //         borderWidth: 1,
        //         borderRadius: SIZES.radius,
        //         borderColor: COLORS.gray2,
        //       }}
        //       iconStyle={{
        //         width: 20,
        //         height: 20,
        //         tintColor: COLORS.black,
        //       }}
        //       onPress={async () => {
        //         dispatch(removeUser());
        //         await Auth.logout();
        //       }}
        //     />
        //     <Text style={{...FONTS.h5, color: COLORS.black}}>تسجيل الخروج</Text>
        //   </View>
        // }
        twoRight={true}
      />
    );
  }

  function renderBody() {
    return (
      <View
        style={{
          padding: SIZES.padding,
          marginBottom: RFValue(66),
        }}>
        <Ionicons
          name="person"
          size={RFValue(80)}
          style={{
            alignSelf: 'center',
          }}
          color={COLORS.lightGray3}
        />
        {/* <FastImage
          source={icons.person}
          style={{
            width: RFValue(80),
            height: RFValue(80),
            alignSelf: 'center',
          }}
          tintColor={COLORS.gray}
          resizeMode="contain"
        /> */}

        {parentData?.map((item, index) => (
          <View
            key={index}
            style={{
              backgroundColor: COLORS.white,
              borderRadius: SIZES.radius,
              padding: SIZES.base,
              marginBottom: RFValue(15),
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}>
            <Text
              style={{
                marginTop: SIZES.radius,
                fontFamily: FONTS.fontFamily,
                ...FONTS.h3,
                marginLeft: 25,
              }}>
              إسم الطالب/ة
            </Text>
            <FormInput
              editable={isEditableMode}
              placeholder={'Enter Your Name'}
              containerStyle={{
                width: '100%',
                alignSelf: 'center',
              }}
              inputStyle={{
                fontFamily: FONTS.fontFamily,
              }}
              value={item?.student_name}
              onChange={value => {
                setUserNameError(false);
                setUserName(value);
              }}
            />

            <Text
              style={{
                marginTop: SIZES.radius,
                fontFamily: FONTS.fontFamily,
                ...FONTS.h3,
                marginLeft: 25,
              }}>
              الرقم القومى
            </Text>
            <FormInput
              editable={isEditableMode}
              placeholder={'Enter Your Name'}
              containerStyle={{
                width: '100%',
                alignSelf: 'center',
              }}
              inputStyle={{
                fontFamily: FONTS.fontFamily,
              }}
              value={item?.student_nat_id}
              onChange={value => {
                setUserNameError(false);
                setUserName(value);
              }}
            />

            <Text
              style={{
                marginTop: SIZES.radius,
                fontFamily: FONTS.fontFamily,
                ...FONTS.h3,
                marginLeft: 25,
              }}>
              كود الطالب/ة
            </Text>
            <FormInput
              editable={isEditableMode}
              placeholder={'Enter Your Name'}
              containerStyle={{
                width: '100%',
                alignSelf: 'center',
              }}
              inputStyle={{
                fontFamily: FONTS.fontFamily,
              }}
              value={item?.student_code}
              onChange={value => {
                setUserNameError(false);
                setUserName(value);
              }}
            />
          </View>
        ))}
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderBody()}
      </ScrollView>

      <Button
        // disabled={!isEditableMode}
        onPress={async () => {
          _logoutStudent();
        }}
        loading={reqLoading}
        disabled={reqLoading}
        mode="contained"
        buttonColor={COLORS.red}
        labelStyle={{
          ...FONTS.h3,
          color: COLORS.white,
          paddingVertical: 4,
        }}
        style={{
          borderRadius: 8,
          marginTop: RFValue(10),
          marginBottom: RFValue(90),
          width: '90%',
          alignSelf: 'center',
        }}>
        تسجيل الخروج
      </Button>
    </View>
  );
};

export default ParentSettings;
