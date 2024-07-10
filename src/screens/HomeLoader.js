import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SIZES} from '../constants';

const MyLoader = props => {
  const newX = RFValue(70);
  return (
    <View style={{...styles.container}}>
      <ContentLoader
        speed={1}
        rtl={true}
        width={SIZES.width}
        height={RFValue(118)}
        viewBox={`0 0 ${SIZES.width} ${RFValue(118)}`}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb">
        <Rect
          x={2}
          y={RFValue(15)}
          rx="0"
          ry="0"
          width={RFValue(56)}
          height={RFValue(50)}
        />
        <Rect
          x={newX}
          y={RFValue(15)}
          rx="3"
          ry="3"
          width={RFValue(130)}
          height="9"
        />
        <Rect
          x={newX}
          y={RFValue(30)}
          rx="3"
          ry="3"
          width={RFValue(130)}
          height="9"
        />
        <Rect
          x={newX}
          y={RFValue(45)}
          rx="3"
          ry="3"
          width={RFValue(130)}
          height="9"
        />
      </ContentLoader>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: RFValue(8),
    paddingHorizontal: RFValue(8),
  },
});

export default MyLoader;
