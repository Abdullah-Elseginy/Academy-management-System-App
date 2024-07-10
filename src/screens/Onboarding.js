import AnimatedLottieView from 'lottie-react-native';
import React, {useRef} from 'react';
import {View, Text, FlatList, Animated} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch} from 'react-redux';
import {TextButton} from '../components';
import {COLORS, FONTS, lotties, SIZES} from '../constants';
import {modifyIsFirst} from '../redux/reducers/UserReducer';
import Auth from '../Services';
const Onboarding = () => {
  const onboarding_screens = [
    {
      id: 1,
      image: lotties.intro1,
      title: 'كلية الحاسبات المعلومات',
      description:
        'تهدف كلية الحاسبات والمعلومات بجامعة طنطا إلى التميز والأرتقاء بالمستوى العلمى والعملى للكلية لتحقيق مكانه مرموقه على المستوى المحلى والدولى',
    },
    {
      id: 2,
      image: lotties.intro2,
      title: 'رسالة الكلية',
      description:
        'تلتزم كلية الحاسبات والمعلومات بجامعة طنطا بالعمل على تقديم مناخ تعليمى وبحثى متميز لبناء كوادر متخصصة تمتلك قدرات تنافسية عالية لخدمة قضايا المجتمع',
    },
    {
      id: 3,
      image: lotties.intro3,
      title: 'أهداف الكلية',
      description:
        'عداد الكوادر البشرية المؤهله بالأسس النظرية والعملية فى قطاعات الدولة المختلفة فى علوم الحاسبات وتكنولوجيا المعلومات ،بما يمكنهم من المنافسة المحلية والعالمية فى هذا التخصص وفروعه المختلف.',
    },
  ];
  const dispatch = useDispatch();
  const flatListRef = useRef();
  const onViewChangeRef = React.useRef(({viewableItems, changes}) => {
    setCurrentIndex(viewableItems[0].index);
  });
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const Dots = () => {
    const dotPosition = Animated.divide(scrollX, SIZES.width);
    return (
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {onboarding_screens.map((item, index) => {
          const dotColor = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [
              COLORS.primaryLite,
              COLORS.primary,
              COLORS.primaryLite,
            ],
            extrapolate: 'clamp',
          });
          const dotWidth = dotPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [10, 30, 10],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={`Dots-${index}`}
              style={{
                borderRadius: 5,
                marginHorizontal: 5,
                width: dotWidth,
                height: 10,
                backgroundColor: dotColor,
              }}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.primaryLite,
        }}>
        <Animated.FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled
          data={onboarding_screens}
          scrollEventThrottle={16}
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => `${item.id}`}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {
              useNativeDriver: false,
            },
          )}
          onViewableItemsChanged={onViewChangeRef.current}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: SIZES.width,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AnimatedLottieView
                  source={item.image}
                  style={{
                    width: RFValue(200),
                    height: RFValue(200),
                  }}
                  loop
                  autoPlay
                  resizeMode="contain"
                />
              </View>
            );
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          marginTop: RFValue(-20),
          borderTopLeftRadius: SIZES.radius * 3,
          borderTopRightRadius: SIZES.radius * 3,
          ...COLORS.shadow,
          padding: SIZES.padding * 2,
        }}>
        <View
          style={{
            // flex: 1,
            justifyContent: 'center',
          }}>
          <Dots />
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{...FONTS.h2, color: COLORS.black, textAlign: 'center'}}>
            {onboarding_screens[currentIndex].title}
          </Text>
          <Text style={{...FONTS.h3, color: COLORS.gray, textAlign: 'center'}}>
            {onboarding_screens[currentIndex].description}
          </Text>
        </View>

        {currentIndex < onboarding_screens.length - 1 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              // paddingHorizontal: SIZES.padding,
              // marginVertical: SIZES.padding,
            }}>
            <TextButton
              label="تخطى"
              buttonContainerStyle={{
                backgroundColor: COLORS.lightGray3,
                height: RFValue(45),
                width: RFValue(125),
                borderRadius: SIZES.base,
              }}
              labelStyle={{
                color: COLORS.darkGray,
                ...FONTS.h3,
              }}
              onPress={async () => {
                dispatch(modifyIsFirst(false));
                await Auth.setFirst('1');
              }}
            />
            <TextButton
              label={'التالى'}
              labelStyle={{
                color: COLORS.white,
                ...FONTS.h3,
              }}
              buttonContainerStyle={{
                backgroundColor: COLORS.primary,
                height: RFValue(45),
                width: RFValue(125),
                borderRadius: SIZES.base,
              }}
              onPress={() => {
                flatListRef?.current?.scrollToIndex({
                  index: currentIndex + 1,
                  animated: true,
                });
              }}
            />
          </View>
        )}

        {currentIndex == 2 && (
          <View
            style={{
              paddingHorizontal: SIZES.padding,
              marginVertical: SIZES.padding,
            }}>
            <TextButton
              label="إبدء"
              labelStyle={{
                ...FONTS.h3,
                color: COLORS.white,
              }}
              buttonContainerStyle={{
                height: 60,
                borderRadius: SIZES.base,
              }}
              onPress={async () => {
                dispatch(modifyIsFirst(false));
                await Auth.setFirst('1');
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default Onboarding;
