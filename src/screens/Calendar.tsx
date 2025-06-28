import React from 'react';
import { View, Text } from 'react-native';
import DefaultScreen from '../components/layout/DefaultScreen';
import CalendarComponent from '../components/ui/Calendar';

const Calendar = () => {
  return (
    <DefaultScreen>
      <CalendarComponent />
    </DefaultScreen>
  );
};

export default Calendar;
