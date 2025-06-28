import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const generateCalendarMatrix = () => {
    const startOfMonth = currentDate.startOf('month');
    const totalDays = currentDate.daysInMonth();
    const startDay = startOfMonth.day();

    const prevMonth = currentDate.subtract(1, 'month');
    const nextMonth = currentDate.add(1, 'month');
    const prevMonthDays = prevMonth.daysInMonth();

    const calendar: dayjs.Dayjs[] = [];

    for (let i = startDay - 1; i >= 0; i--) {
      calendar.push(prevMonth.date(prevMonthDays - i));
    }

    for (let i = 1; i <= totalDays; i++) {
      calendar.push(currentDate.date(i));
    }

    const remaining = 7 - (calendar.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        calendar.push(nextMonth.date(i));
      }
    }

    return calendar;
  };

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
    setSelectedDate(null);
  };

  const renderDay = (date: dayjs.Dayjs, index: number) => {
    const isSelected = selectedDate?.isSame(date, 'date');
    const isThisMonth = date.month() === currentDate.month();

    return (
      <TouchableOpacity
        key={index}
        style={styles.dayCell}
        onPress={() => setSelectedDate(date)}
        disabled={!isThisMonth}
      >
        <View style={[styles.dateWrapper, isSelected && styles.selectedDate]}>
          <Text style={[styles.dateText, !isThisMonth && { color: '#ccc' }]}>
            {date.date()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const calendarMatrix = generateCalendarMatrix();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text style={styles.arrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>{currentDate.format('MMMM YYYY')}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.arrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekRow}>
        {DAYS.map((d, idx) => {
          let color = '#666666';

          switch (d) {
            case 'Sun':
              color = 'red';
              break;
            case 'Sat':
              color = 'skyblue';
              break;
          }

          return (
            <Text key={idx} style={(styles.weekDay, { color })}>
              {d}
            </Text>
          );
        })}
      </View>
      <View style={styles.daysGrid}>
        {calendarMatrix.map((date, index) => renderDay(date, index))}
      </View>
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: 20,
    paddingHorizontal: 12,
    color: 'skyblue',
    fontWeight: 600,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  weekDay: {
    width: 32,
    textAlign: 'center',
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDate: {
    borderColor: '#007AFF',
    borderWidth: 1,
    fontWeight: '600',
    color: '#000',
  },
  dateText: {
    fontWeight: '400',
    color: '#000',
  },
});
