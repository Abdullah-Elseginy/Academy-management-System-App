import React, {useState} from 'react';
import {View, Text} from 'react-native';
import moment from 'moment';
import Timetable from 'react-native-calendar-timetable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {COLORS, SIZES, FONTS} from '../../../constants';
import {ScrollView} from 'react-native-gesture-handler';
function CalenderItem({style, item, dayIndex, daysTotal}) {
  return (
    <View
      style={{
        ...style, // apply calculated styles, be careful not to override these accidentally (unless you know what you are doing)
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        elevation: 5,
      }}>
      <Text style={{...FONTS.h3, COLORS: COLORS.white}}>{item.title}</Text>
      <Text>
        {dayIndex} of {daysTotal}
      </Text>
    </View>
  );
}
const BatchTable = ({navigation}) => {
  const [date] = useState(new Date());
  const [from] = useState(moment().subtract(3, 'days').toDate());
  const [till] = useState(moment().add(3, 'days').toISOString());
  const range = {from, till};
  const [items] = useState([
    {
      title: 'Some event',
      startDate: moment().subtract(1, 'hour').toDate(),
      endDate: moment().add(1, 'hour').toDate(),
    },
    {
      title: 'Some event',
      startDate: moment().add(2, 'hour').toDate(),
      endDate: moment().add(3, 'hour').toDate(),
    },
    {
      title: 'Some event',
      startDate: moment().add(4, 'hour').toDate(),
      endDate: moment().add(1, 'hour').toDate(),
    },
  ]);
  function renderHeader() {
    return (
      <View
        style={{
          height: 50,
          marginHorizontal: SIZES.padding,
          marginTop: 25,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <FontAwesome name="angle-double-down" size={30} color={COLORS.dark} />
      </View>
    );
  }

  function renderBody() {
    return (
      <View>
        <Timetable
          // these two are required
          items={items}
          renderItem={props => <CalenderItem {...props} />}
          // provide only one of these
          date={date}
          range={range}
        />
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      {renderHeader()}
      <ScrollView
        contentContainerStyle={
          {
            // flexGrow: 1,
            // marginTop: SIZES.radius,
            // paddingHorizontal: SIZES.padding,
            // paddingBottom: SIZES.radius,
          }
        }>
        {renderBody()}
      </ScrollView>
    </View>
  );
};

export default BatchTable;
