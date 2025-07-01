import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CELL_WIDTH = 50;
const CELL_HEIGHT = 50;

const Calendar = () => {
  const [mode, setMode] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const [weekDates, setWeekDates] = useState<dayjs.Dayjs[]>(() => {
    const start = selectedDate.startOf('week').subtract(20, 'week');
    return Array.from({ length: 41 * 7 }).map((_, i) => start.add(i, 'day'));
  });

  const flatListRef = useRef<FlatList>(null);

  const translateY = useSharedValue(0);
  const gestureHandler = useAnimatedGestureHandler({
    onEnd: (event) => {
      if (event.velocityY < -300) {
        runOnJS(setMode)('week');
      } else if (event.velocityY > 300) {
        runOnJS(setMode)('month');
      }
      translateY.value = withTiming(0);
    },
  });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const getCalendarDates = () => {
    const startOfMonth = currentDate.startOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = currentDate.daysInMonth();

    const prevMonth = currentDate.subtract(1, 'month');
    const nextMonth = currentDate.add(1, 'month');
    const prevMonthDays = prevMonth.daysInMonth();

    const calendar: dayjs.Dayjs[] = [];

    for (let i = startDay - 1; i >= 0; i--) {
      calendar.push(prevMonth.date(prevMonthDays - i));
    }

    for (let i = 1; i <= daysInMonth; i++) {
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

  const extendWeekDates = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      const last = weekDates[weekDates.length - 1];
      const more = Array.from({ length: 7 * 2 }).map((_, i) =>
        last.add(i + 1, 'day')
      );
      setWeekDates([...weekDates, ...more]);
    } else {
      const first = weekDates[0];
      const more = Array.from({ length: 7 * 2 })
        .map((_, i) => first.subtract(i + 1, 'day'))
        .reverse();
      setWeekDates([...more, ...weekDates]);
    }
  };

  const [visibleStartDate, setVisibleStartDate] = useState(
    selectedDate.startOf('week')
  );

  const monthDates = getCalendarDates();

  const renderDay = (date: dayjs.Dayjs, index: number) => {
    const isSelected = selectedDate.isSame(date, 'date');
    const isThisMonth =
      mode === 'month' ? date.month() === currentDate.month() : true;

    return (
      <TouchableOpacity
        key={index}
        style={styles.dayCell}
        onPress={() => {
          setSelectedDate(date);
          if (mode === 'month') setCurrentDate(date);
          else setVisibleStartDate(date.startOf('week'));
        }}
      >
        <View style={[styles.dateWrapper, isSelected && styles.selectedDate]}>
          <Text style={[styles.dateText, !isThisMonth && { color: '#ccc' }]}>
            {date.date()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderWeekItem = ({ item }: { item: dayjs.Dayjs }) => {
    const index = weekDates.findIndex((d) => d.isSame(item, 'date'));
    return renderDay(item, index);
  };

  const onWeekScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const visibleIndex = Math.floor(offsetX / CELL_WIDTH);

    const firstVisibleDate = weekDates[visibleIndex];
    if (firstVisibleDate) setVisibleStartDate(firstVisibleDate.startOf('week'));

    if (visibleIndex < 14) {
      extendWeekDates('left');
    } else if (visibleIndex > weekDates.length - 21) {
      extendWeekDates('right');
    }
  };

  useEffect(() => {
    if (mode === 'week') {
      const targetDate = selectedDate ?? dayjs(); // 선택된 날짜 없으면 오늘

      const index = weekDates.findIndex((d) => d.isSame(targetDate, 'date'));

      if (index !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({ index, animated: false });
      }
    }
  }, [mode]);

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[animatedStyle, styles.container]}>
        <View style={styles.header}>
          {mode === 'month' ? (
            <>
              <TouchableOpacity
                onPress={() => setCurrentDate(currentDate.subtract(1, 'month'))}
              >
                <Text style={styles.arrow}>{'<'}</Text>
              </TouchableOpacity>
              <Text style={styles.headerText}>
                {currentDate.format('MMMM YYYY')}
              </Text>
              <TouchableOpacity
                onPress={() => setCurrentDate(currentDate.add(1, 'month'))}
              >
                <Text style={styles.arrow}>{'>'}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.headerText}>
              {visibleStartDate.format('MMMM YYYY')}
            </Text>
          )}
        </View>

        <View style={styles.weekRow}>
          {DAYS.map((d, i) => {
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
              <Text key={i} style={(styles.weekDay, { color })}>
                {d}
              </Text>
            );
          })}
        </View>

        {mode === 'month' ? (
          <View style={styles.daysGrid}>
            {monthDates.map((date, i) => renderDay(date, i))}
          </View>
        ) : (
          <FlatList
            initialNumToRender={14}
            maxToRenderPerBatch={14}
            windowSize={5}
            ref={flatListRef}
            data={weekDates}
            renderItem={renderWeekItem}
            keyExtractor={(item) => item.format('YYYY-MM-DD')}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={onWeekScroll}
            getItemLayout={(_, index) => ({
              length: CELL_WIDTH,
              offset: CELL_WIDTH * index,
              index,
            })}
          />
        )}
      </Animated.View>
    </PanGestureHandler>
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
    width: CELL_WIDTH,
    textAlign: 'center',
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
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
