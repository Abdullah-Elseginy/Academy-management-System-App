import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {RFValue} from 'react-native-responsive-fontsize';
import {FormInput, TextButton} from '../../../components';
import {MotiView, useAnimationState} from 'moti';
import {Shadow} from 'react-native-shadow-2';
import {FONTS, SIZES, COLORS, icons, images} from '../../../constants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import utils from '../../../utils';
import {useDispatch} from 'react-redux';
import {
  modifyUserLogin,
  modifyUserType,
  setUser,
} from '../../../redux/reducers/UserReducer';
import Auth from '../../../Services';
import {POST} from '../../../Helpers/ApiHelper';
import DropDownPicker from 'react-native-dropdown-picker';
import {setParentData} from '../../../redux/reducers/ParentReducer';
import {setProf} from '../../../redux/reducers/ProfReducer';
import messaging from '@react-native-firebase/messaging';

const AuthMain = ({navigation}) => {
  const dispatch = useDispatch();
  // States
  const [mode, setMode] = useState('signIn');
  const [nationalNumber, setNationalNumber] = useState('');
  const [studentCode, setStudentCode] = useState('');

  const [parentCode, setParentCode] = useState('');
  const [parentNationalId, setParentNationalId] = useState('');

  const [profCode, setProfCode] = useState('');
  const [profPass, setProfPass] = useState('');

  const [reqLoading, setReqLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('1');
  const [items, setItems] = useState([
    {label: 'عضو هيئة تدريس', value: '1'},
    {label: 'ولى أمر', value: '2'},
  ]);
  // Animation States
  const animationState = useAnimationState({
    signIn: {
      height: SIZES.height * 0.5,
    },
    signUp: {
      height: SIZES.height * 0.6,
    },
  });

  useEffect(() => {
    animationState.transitionTo('signIn');
  }, []);

  const validate = value => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
  };

  async function _checkSignin() {
    let token = await messaging().getToken();

    let student_nat_id = nationalNumber.trim();
    if (
      !student_nat_id.match(
        '^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$',
      )
    ) {
      utils.toastAlert('error', 'الرقم القومى', 'برجاء إدخال رقم قومى صحيح');
      return;
    }
    if (studentCode == '') {
      utils.toastAlert('error', 'كود الطالب/ة', 'برجاء إدخال كود الطالب/ة');
      return;
    }
    setReqLoading(true);
    let data_to_send = {
      student_code: studentCode.trim(),
      student_nat_id,
      token,
    };
    let res = await POST('student_login.php', data_to_send);

    if (res && typeof res === 'object') {
      dispatch(setUser({...res, type: '1'}));
      await Auth.setAccount({...res, type: '1'});
    }

    setReqLoading(false);
  }
  async function _checkSignup() {
    let token = await messaging().getToken();

    let data_to_send = {token};

    if (value == '1') {
      if (profCode == '') {
        utils.toastAlert(
          'error',
          'عضو هيئة تدريس',
          'برجاء إدخال الكود الخاص بك',
        );
        return;
      }

      if (profPass == '') {
        utils.toastAlert(
          'error',
          'عضو هيئة تدريس',
          'برجاء إدخال كلمة المرور الخاصة بك',
        );
        return;
      }
      data_to_send['doctor_code'] = profCode.trim();
      data_to_send['doctor_pass'] = profPass.trim();

      // else {
      //   // data_to_send["doctor_email"]=doctor_email.tri
      // }
    } else {
      // !student_nat_id.match(
      //   '^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$',
      // )
      if (parentNationalId == '') {
        utils.toastAlert('error', 'ولى أمر', 'برجاء إدخال الرقم القومى');
        return;
      }
      if (parentCode == '') {
        utils.toastAlert('error', 'ولى أمر', 'برجاء إدخال كود الدخول');
        return;
      }

      data_to_send['parent_nat_id'] = parentNationalId.trim();
      data_to_send['parent_pass'] = parentCode.trim();
    }

    setReqLoading(true);

    let subDomain =
      value == '1' ? 'doctor/doctor_login.php' : 'parent_login.php';
    let res = await POST(subDomain, data_to_send);
    if (value == '2' && Array.isArray(res)) {
      dispatch(setParentData(res));
      dispatch(modifyUserLogin(true));
      dispatch(modifyUserType('2'));
      await Auth.setAccount({data: res, type: '2'});
    }

    if (value == '1' && typeof res === 'object' && res != null) {
      dispatch(setProf(res));
      dispatch(modifyUserLogin(true));
      dispatch(modifyUserType('3'));
      await Auth.setAccount({data: res, type: '3'});
    }

    setReqLoading(false);
  }

  function renderSignIn() {
    return (
      <MotiView
        state={animationState}
        style={{
          marginTop: SIZES.padding,
          alignSelf: 'center',
          height: SIZES.height * 0.5,
        }}>
        <Shadow>
          <View style={styles.authContainer}>
            <Text
              style={{
                width: '60%',
                lineHeight: 45,
                color: COLORS.darkBlue,
                ...FONTS.h2,
              }}>
              تسجيل الدخول للمتابعة
            </Text>
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              enableOnAndroid={true}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              extraScrollHeight={-300}
              contentContainerStyle={
                {
                  // flexGrow: 1,
                  // justifyContent: 'center',
                }
              }>
              <FormInput
                containerStyle={{
                  marginTop: SIZES.radius,
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.error,
                }}
                keyboardType="number-pad"
                placeholder="الرقم القومى"
                value={nationalNumber}
                onChange={text => setNationalNumber(text)}
                prependComponent={
                  <FastImage
                    source={icons.id_card}
                    style={{width: 25, height: 24, marginRight: SIZES.base}}
                  />
                }
              />

              <FormInput
                containerStyle={{
                  marginTop: SIZES.radius,
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.error,
                }}
                keyboardType="number-pad"
                placeholder="كود الطالب/ة"
                value={studentCode}
                onChange={text => setStudentCode(text)}
                prependComponent={
                  <FastImage
                    source={icons.id}
                    style={{width: 25, height: 24, marginRight: SIZES.base}}
                  />
                }
              />
            </KeyboardAwareScrollView>
            <TextButton
              label={'تسجيل الدخول'}
              loading={reqLoading}
              disabled={reqLoading}
              buttonContainerStyle={{
                height: 55,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.primary,
                marginTop: RFValue(20),
              }}
              labelStyle={{
                ...FONTS.h3,
                color: COLORS.white,
              }}
              onPress={() => _checkSignin()}
            />
          </View>
        </Shadow>
      </MotiView>
    );
  }

  function renderSignUp() {
    return (
      <MotiView
        state={animationState}
        style={{
          marginTop: SIZES.padding,
          alignSelf: 'center',
          height: SIZES.height * 0.5,
        }}>
        <Shadow>
          <View style={styles.authContainer}>
            <Text
              style={{
                width: '60%',
                lineHeight: 45,
                color: COLORS.darkBlue,
                ...FONTS.h2,
              }}>
              دخول ولى أمر و عضو هيئة تدريس
            </Text>
            <View
              // enableOnAndroid={true}
              // keyboardDismissMode="on-drag"
              // keyboardShouldPersistTaps="handled"
              // extraScrollHeight={-300}
              style={{
                flexGrow: 1,
                marginTop: SIZES.padding,
                paddingBottom: SIZES.padding * 2,
              }}>
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                modalTitle="نوع المستخدم"
                bottomOffset={100}
                modalProps={{
                  animationType: 'slide',
                }}
                listMode="SCROLLVIEW"
                dropDownDirection="TOP"
                theme="DARK"
                mode="BADGE"
                dropDownContainerStyle={{
                  borderColor: COLORS.secondary,
                }}
                selectedItemContainerStyle={{
                  backgroundColor: COLORS.darkOverlayColor,
                }}
                labelStyle={{
                  ...FONTS.h3,
                }}
                listItemLabelStyle={{
                  ...FONTS.h3,
                }}
                selectedItemLabelStyle={{
                  ...FONTS.h3,
                }}
                itemSeparatorStyle={{
                  backgroundColor: COLORS.secondary,
                }}
                style={{
                  alignSelf: 'center',
                  width: '100%',
                  borderColor: COLORS.secondary,
                }}
              />

              {value == '1' ? (
                <>
                  <FormInput
                    containerStyle={{
                      marginTop: SIZES.radius,
                      borderRadius: SIZES.radius,
                      backgroundColor: COLORS.error,
                    }}
                    keyboardType="number-pad"
                    placeholder="كود الدخول"
                    value={profCode}
                    onChange={text => setProfCode(text)}
                    prependComponent={
                      <FastImage
                        source={icons.id}
                        style={{width: 25, height: 24, marginRight: SIZES.base}}
                      />
                    }
                  />

                  <FormInput
                    containerStyle={{
                      marginTop: SIZES.radius,
                      borderRadius: SIZES.radius,
                      backgroundColor: COLORS.error,
                    }}
                    keyboardType="number-pad"
                    placeholder="كلمة المرور"
                    value={profPass}
                    onChange={text => setProfPass(text)}
                    prependComponent={
                      <FastImage
                        source={icons.id}
                        style={{width: 25, height: 24, marginRight: SIZES.base}}
                      />
                    }
                  />
                </>
              ) : (
                <>
                  <FormInput
                    containerStyle={{
                      marginTop: SIZES.radius,
                      borderRadius: SIZES.radius,
                      backgroundColor: COLORS.error,
                    }}
                    keyboardType="number-pad"
                    placeholder="الرقم القومى"
                    value={parentNationalId}
                    onChange={text => setParentNationalId(text)}
                    prependComponent={
                      <FastImage
                        source={icons.id_card}
                        style={{width: 25, height: 24, marginRight: SIZES.base}}
                      />
                    }
                  />
                  <FormInput
                    containerStyle={{
                      marginTop: SIZES.radius,
                      borderRadius: SIZES.radius,
                      backgroundColor: COLORS.error,
                    }}
                    keyboardType="number-pad"
                    placeholder="كود دخول ولى الأمر"
                    value={parentCode}
                    onChange={text => setParentCode(text)}
                    prependComponent={
                      <FastImage
                        source={icons.id}
                        style={{width: 25, height: 24, marginRight: SIZES.base}}
                      />
                    }
                  />
                </>
              )}
            </View>
            <TextButton
              label={'تسجيل الدخول'}
              loading={reqLoading}
              disabled={reqLoading}
              buttonContainerStyle={{
                height: 55,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.primary,
                marginTop: RFValue(20),
              }}
              labelStyle={{
                ...FONTS.h3,
                color: COLORS.white,
              }}
              onPress={() => _checkSignup()}
            />
          </View>
        </Shadow>
      </MotiView>
    );
  }

  function renderAuthContainer() {
    if (mode == 'signIn') {
      return renderSignIn();
    } else {
      return renderSignUp();
    }
  }

  function renderAuthContainerFooter() {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 80,
          alignItems: 'flex-end',
          justifyContent: 'center',
          marginTop: -30,
          marginHorizontal: SIZES.radius,
          paddingBottom: SIZES.radius,
          borderBottomLeftRadius: SIZES.radius,
          borderBottomRightRadius: SIZES.radius,
          backgroundColor: COLORS.light60,
          zIndex: 0,
        }}>
        <TextButton
          label={
            mode == 'signIn'
              ? 'دخول ك ولى أمر او عضو هيئة تدريس؟'
              : 'دخول ك طالب/ة؟'
          }
          buttonContainerStyle={{
            marginLeft: SIZES.base,
            backgroundColor: null,
          }}
          labelStyle={{
            color: COLORS.support4,
            ...FONTS.h5,
          }}
          onPress={() => {
            if (animationState.current === 'signIn') {
              animationState.transitionTo('signUp');
              setMode('signUp');
            } else {
              animationState.transitionTo('signIn');
              setMode('signIn');
            }
          }}
        />
      </View>
    );
  }

  function renderSocialLogins() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -30,
          zIndex: -1,
        }}>
        <Text
          style={{
            color: COLORS.dark,
            ...FONTS.body3,
          }}>
          ©️ 2023 FCI Tanta University
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FastImage
        source={images.main_logo}
        style={{
          alignSelf: 'center',
          marginTop: SIZES.padding * 2,
          width: RFValue(80),
          height: RFValue(80),
        }}
      />
      {/* Auth Container */}
      <View
        style={{
          zIndex: 1,
        }}>
        {renderAuthContainer()}
      </View>

      {renderAuthContainerFooter()}

      {renderSocialLogins()}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.lightGray,
  },
  authContainer: {
    flex: 1,
    width: SIZES.width - SIZES.padding * 2,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.light,
    // alignSelf: 'center',
    zIndex: 1,
  },
  socialButtonContainer: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.gray3,
  },
});

export default AuthMain;
