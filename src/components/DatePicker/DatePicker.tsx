import React, {
  createRef,
  Dispatch,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";
import {
  LayoutChangeEvent,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, spacing } from "@/theme";
import { Icon } from "@/components";
import DayList, { TMonthDetails } from "./DayList";


    import { moderateScale } from "@/utils";

// import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
// import ArrowDown from "./ArrowDown";
// import ArrowLeft from "./ArrowLeft";
// import ArrowRight from "./ArrowRight";
import {
  getDateStringFromTimestamp,
  getMonthDetails,
  IMonthMap,
  monthMap,
} from "./helpers";
import MonthList from "./MonthList";
import YearsList from "./YearsList";

interface IDatePickerProps {
  maxYear?: number;
  maxMonth?: number;
  maxDay?: number;
  onSelectDate: Dispatch<string>;
  onCancel: () => void;
  showDatePicker: boolean;
}

interface IInitialState {
  todayTimestamp: number;
  year: number;
  selectYear: boolean;
  yearListIndex?: number;
  month: number;
  selectMonth: boolean;
  monthListIndex?: number;
  selectedDay: number;
  monthDetails: TMonthDetails[];
}

const date = new Date();
const oneDay = 60 * 60 * 24 * 1000;
const todayTimestamp =
  date.getTime() -
  (date.getTime() % oneDay) +
  date.getTimezoneOffset() * 1000 * 60;

const initialState: IInitialState = {
  todayTimestamp: todayTimestamp, // or todayTimestamp, for short
  year: date.getFullYear(),
  selectYear: false,
  month: date.getMonth(),
  selectMonth: false,
  selectedDay: todayTimestamp,
  monthDetails: getMonthDetails(date.getFullYear(), date.getMonth()),
};

export default function DatePicker({
  maxDay,
  maxMonth,
  maxYear,
  onSelectDate,
  onCancel,
  showDatePicker,
}: IDatePickerProps) {
  const inputRef = createRef<TextInput>();
  const minDatepickerHeight = useRef<number>(0);

  const [state, dispatch] = useReducer(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (state: IInitialState, newState: Partial<IInitialState>) => ({
      ...state,
      ...newState,
    }),
    initialState
  );

  const closeDatePicker = () => {
    if (state.selectMonth) dispatch({ selectMonth: false });
    if (state.selectYear) dispatch({ selectYear: false });
    onCancel();
  };

  const getMonthString = (month: number) =>
    monthMap[Math.max(Math.min(11, month), 0)].long[
      'en' as keyof IMonthMap["long"]
    ] || "Month";


  const selectYear = (year: number) => {
    dispatch({
      selectMonth: false,
      year: year,
      monthDetails: getMonthDetails(year, state.month),
      selectYear: false,
    });
  };

  // const setMonth = (offset: number) => {
  //   let year = state.year;
  //   let month = state.month + offset;
  //   if (maxMonth && maxMonth < month && maxYear! <= state.year && offset > 0)
  //     return;
  //   if (month === -1) {
  //     month = 11;
  //     year--;
  //   } else if (month === 12) {
  //     month = 0;
  //     year++;
  //   }
  //   if (maxYear && year > maxYear) return;
  //   dispatch({
  //     year: year,
  //     month: month,
  //     monthDetails: getMonthDetails(year, month),
  //   });
  // };

  const selectMonth = (month: number) => {
    dispatch({
      selectYear: false,
      month: month,
      monthDetails: getMonthDetails(state.year, month),
      selectMonth: false,
    });
  };

  const setDateToInput = (timestamp: number) => {
    const dateString = getDateStringFromTimestamp(timestamp);
    //@ts-ignore
    if (inputRef.current) inputRef.current.value! = dateString;
  };

  const onDateClick = (day: { timestamp: number }) => {
    dispatch({
      selectedDay: day.timestamp,
    });
    setDateToInput(day.timestamp);
    // Don't call onSelectDate here - wait for OK button press
  };

  const restrictDay = useCallback(
    (day: number) => {
      if (
        maxMonth! === state.month &&
        maxYear! <= state.year &&
        maxDay! < day
      ) {
        return true;
      }

      return false;
    },
    [maxMonth, maxYear, maxDay, state.month, state.year]
  );

  useEffect(() => {
    if (maxYear) {
      dispatch({
        year: maxYear,
        month: maxMonth,
        monthDetails: getMonthDetails(maxYear, maxMonth!),
      });
    }
  }, [maxYear, maxMonth]);

  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height },
      },
    }: LayoutChangeEvent) => {
      minDatepickerHeight.current = height;
    },
    []
  );

  const handleClear = () => {
    dispatch({
      selectedDay: 0,
    });
    onSelectDate('');
    closeDatePicker();
  };

  const formatSelectedDate = (timestamp: number) => {
    if (timestamp === 0) return '';
    const dateObj = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return dateObj.toLocaleDateString('en-US', options);
  };

  const handleOK = () => {
    if (state.selectedDay === 0) {
      onSelectDate('');
      closeDatePicker();
      return;
    }
    const dateString = getDateStringFromTimestamp(state.selectedDay);
    onSelectDate(dateString);
    closeDatePicker();
  };

  return (
    <Modal
      visible={showDatePicker}
      transparent
      animationType="fade"
      onRequestClose={closeDatePicker}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={closeDatePicker}
      >
        <View
          style={[
            styles.datePicker,
            { minHeight: minDatepickerHeight.current },
          ]}
          onLayout={onLayout}
          onStartShouldSetResponder={() => true}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerLabel}>Select date</Text>
          </View>

          {/* Selected Date Display */}
          {state.selectedDay !== 0 && (
            <>
              <View style={styles.selectedDateContainer}>
                <Text style={styles.selectedDateText}>
                  {formatSelectedDate(state.selectedDay)}
                </Text>
                <Icon name="Edit" size={moderateScale(20)} color={colors.gray600} />
              </View>
              {/* Divider after selected date */}
              <View style={styles.divider} />
            </>
          )}

          {/* Month/Year Selector with Navigation */}
          <View style={styles.monthYearContainer}>
            <TouchableOpacity
              style={styles.monthYearSelector}
              testID="select-month"
              onPress={() =>
                dispatch({
                  selectMonth: !state.selectMonth,
                  selectYear: false,
                })
              }
            >
              <Text style={styles.monthYearText}>
                {getMonthString(state.month)} {state.year}
              </Text>
              <View style={state.selectMonth || state.selectYear ? styles.select_icon_open : {}}>
                <Icon name="ChevronDown" size={moderateScale(20)} color={colors.black} />
              </View>
            </TouchableOpacity>
            <View style={styles.navigationArrows}>
              <TouchableOpacity
                onPress={() => {
                  const prevMonth = state.month === 0 ? 11 : state.month - 1;
                  const prevYear = state.month === 0 ? state.year - 1 : state.year;
                  if (maxYear && prevYear > maxYear) return;
                  if (maxYear && prevYear === maxYear && maxMonth !== undefined && prevMonth > maxMonth) return;
                  dispatch({
                    month: prevMonth,
                    year: prevYear,
                    monthDetails: getMonthDetails(prevYear, prevMonth),
                  });
                }}
                style={styles.navArrow}>
                <Icon name="ChevronLeft" size={moderateScale(20)} color={colors.black} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const nextMonth = state.month === 11 ? 0 : state.month + 1;
                  const nextYear = state.month === 11 ? state.year + 1 : state.year;
                  if (maxYear && nextYear > maxYear) return;
                  if (maxYear && nextYear === maxYear && maxMonth !== undefined && nextMonth > maxMonth) return;
                  dispatch({
                    month: nextMonth,
                    year: nextYear,
                    monthDetails: getMonthDetails(nextYear, nextMonth),
                  });
                }}
                style={styles.navArrow}>
                <Icon name="ChevronRight" size={moderateScale(20)} color={colors.black} />
              </TouchableOpacity>
            </View>
          </View>
          {state.selectYear ? (
            <YearsList
              currentMonth={state.month}
              currentYear={state.year}
              maxMonth={maxMonth}
              maxYear={maxYear}
              onSelectYear={selectYear}
            />
          ) : state.selectMonth ? (
            <MonthList
              currentMonth={state.month}
              currentYear={state.year}
              maxMonth={maxMonth}
              maxYear={maxYear}
              onSelectMonth={selectMonth}
            />
          ) : (
            <DayList
              monthDetails={state.monthDetails}
              selectedDay={state.selectedDay}
              todayTimestamp={todayTimestamp}
              onDateClick={onDateClick}
              onRestrictDay={restrictDay}
            />
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={handleClear} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Clear</Text>
            </TouchableOpacity>
            <View style={styles.rightButtons}>
              <TouchableOpacity onPress={closeDatePicker} style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOK} style={styles.actionButton}>
                <Text style={[styles.actionButtonText, styles.okButtonText]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePicker: {
    width: "90%",
    maxWidth: moderateScale(400),
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    paddingTop: moderateScale(spacing.lg),
    paddingBottom: moderateScale(spacing.md),
    paddingHorizontal: moderateScale(spacing.lg),
    maxHeight: "80%",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    marginBottom: moderateScale(spacing.sm),
  },
  headerLabel: {
    fontSize: moderateScale(12),
    color: colors.gray500,
    fontWeight: "400",
  },
  selectedDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(spacing.sm),
    marginBottom: moderateScale(spacing.md),
  },
  selectedDateText: {
    fontSize: moderateScale(24),
    color: colors.gray900,
    fontWeight: "700",
  },
  monthYearContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(spacing.md),
  },
  monthYearSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(spacing.xs),
  },
  monthYearText: {
    fontSize: moderateScale(16),
    color: colors.black,
    fontWeight: "400",
  },
  navigationArrows: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(spacing.md),
  },
  navArrow: {
    padding: moderateScale(spacing.xs),
  },
  select_icon_open: {
    transform: [{ rotate: "180deg" }],
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: moderateScale(spacing.md),
  },
  dividerBottom: {
    height: 1,
    backgroundColor: colors.gray200,
    marginTop: moderateScale(spacing.md),
    marginBottom: 0,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: moderateScale(spacing.md),
    paddingBottom: 0,
  },
  actionButton: {
    paddingVertical: moderateScale(spacing.xs),
  },
  actionButtonText: {
    fontSize: moderateScale(16),
    color: colors.accent,
    fontWeight: "400",
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(spacing.lg),
  },
  okButtonText: {
    fontWeight: "700",
  },
});
