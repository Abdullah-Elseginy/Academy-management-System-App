import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import {FormInput, Header, TextIconButton} from '../../../components';
import {COLORS, FONTS, lotties, SIZES} from '../../../constants';
import {RFValue} from 'react-native-responsive-fontsize';
import MyLoader from '../../HomeLoader';
import {useDispatch, useSelector} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import BatchItem from './BatchItem';
import {modifyBatchData} from '../../../redux/reducers/UserReducer';
import {POST} from '../../../Helpers/ApiHelper';

const Home = ({navigation}) => {
  const dispatch = useDispatch();
  const [loadingPage, setLoadingPage] = useState(true);
  const {netinfo, userData, userType} = useSelector(s => s.UserReducer);
  const [batchs, setBatchs] = useState([]);
  useEffect(() => {
    if (userData?.student_id != undefined) {
      getDataStudent();
    }
  }, [netinfo]);

  async function getDataStudent() {
    let data_to_send = {
      student_id: userData?.student_id,
    };
    let res = await POST('select_sub_generation.php', data_to_send);
    if (res && Array.isArray(res)) {
      setBatchs(res);
    }
    setLoadingPage(false);
  }

  function renderHeader() {
    return (
      <Header
        title={'الدفعات'}
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
      <FlatList
        data={batchs}
        contentContainerStyle={{
          marginTop: SIZES.radius,
          paddingHorizontal: SIZES.padding,
          paddingBottom: SIZES.padding * 2,
        }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `batch-${index}`}
        renderItem={({item, index}) => {
          return (
            <BatchItem
              index={index}
              item={item}
              onPress={psItem => {
                dispatch(modifyBatchData(psItem));
                navigation.navigate('Batch');
              }}
            />
          );
        }}
        ListEmptyComponent={() => {
          if (!loadingPage) {
            return (
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
            );
          }
        }}
      />
    );
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      {renderHeader()}

      {renderBody()}
    </View>
  );
};

export default Home;
