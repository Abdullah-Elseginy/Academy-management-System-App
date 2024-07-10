import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import {Header} from '../../../components';
import {COLORS, FONTS, lotties, SIZES} from '../../../constants';
import {RFValue} from 'react-native-responsive-fontsize';
import MyLoader from '../../HomeLoader';
import {useDispatch, useSelector} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import {POST} from '../../../Helpers/ApiHelper';
import * as Animatable from 'react-native-animatable';
import {setProfSub} from '../../../redux/reducers/ProfReducer';

const HomeProf = ({navigation}) => {
  const dispatch = useDispatch();
  const [loadingPage, setLoadingPage] = useState(true);
  const {netinfo, userType} = useSelector(s => s.UserReducer);
  const {profData} = useSelector(s => s.ProfReducer);
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    if (profData?.doctor_id != undefined) {
      getDataProf();
    }
  }, [netinfo]);

  async function getDataProf() {
    let data_to_send = {
      doctor_id: profData?.doctor_id,
    };

    let res = await POST('doctor/select_doctor_sub.php', data_to_send);
    if (res && Array.isArray(res)) {
      setSubjects(res);
    }
    setLoadingPage(false);
  }

  function renderHeader() {
    return (
      <Header
        title={'المواد'}
        containerStyle={{
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 25,
        }}
        twoRight={true}
      />
    );
  }

  function renderBody() {
    if (loadingPage) {
      return (
        <View style={{flex: 1}}>
          <FlatList
            // numColumns={2}
            keyExtractor={item => `wcp21#-${item}`}
            data={['0', '1', '2', '3', '4', '5', '6', '7']}
            renderItem={() => <MyLoader />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    }

    if (!netinfo) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <AnimatedLottieView
            source={lotties.nonetwork}
            autoPlay
            loop
            style={{height: RFValue(180), width: '100%'}}
            resizeMode="contain"
          />
          <Text
            style={{
              ...FONTS.h3,
              color: COLORS.black,
            }}>
            برجاء التأكد من اتصال الانترنت
          </Text>
        </View>
      );
    }

    return (
      <>
        {subjects.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}>
            {subjects?.map((item, index) => {
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
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(setProfSub(item));
                      navigation.navigate('SubjectProf');
                    }}>
                    <Text
                      style={{
                        ...FONTS.h3,

                        color: COLORS.dark,
                      }}>
                      {item?.subject_name}
                    </Text>
                    <AnimatedLottieView
                      source={lotties.book_subject}
                      autoPlay
                      loop={false}
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
            })}
          </View>
        ) : (
          <>
            {!loadingPage && (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AnimatedLottieView
                  source={lotties.emptyData}
                  autoPlay
                  loop
                  style={{height: RFValue(180), width: '100%'}}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: COLORS.black,
                    ...FONTS.h2,
                  }}>
                  لا توجد بيانات لعرضها
                </Text>
              </View>
            )}
          </>
        )}
      </>
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
        {renderBody()}
      </ScrollView>
    </View>
  );
};

export default HomeProf;
