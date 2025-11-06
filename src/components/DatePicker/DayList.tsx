import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "@/theme";
import { daysMap, IDaysMap } from "./helpers";
import { moderateScale } from "@/utils";

export type TMonthDetails = {
  date: number;
  day: number;
  dayString: string | IDaysMap;
  month: number;
  timestamp: number;
};
type TDayListProps = {
  monthDetails: TMonthDetails[];
  todayTimestamp: number;
  selectedDay: number;
  onDateClick: (day: TMonthDetails) => void;
  onRestrictDay: (day: number) => boolean;
};
export default function DayList({
  monthDetails,
  todayTimestamp,
  selectedDay,
  onDateClick,
  onRestrictDay,
}: TDayListProps) {
  const isCurrentDay = (day: { timestamp: number }) =>
    day.timestamp === todayTimestamp;

  const isSelectedDay = (day: { timestamp: number }) =>
    day.timestamp === selectedDay;
  return (
    <View>
      <View style={[styleSheet.cch_name, { flexWrap: "wrap" }]}>
        {daysMap.map((day: any, i: number) => (
          <View key={i} style={styleSheet.dayBtn}>
            <Text style={[styleSheet.dayText, { fontWeight: "500" }]}>
              {day['en']}
            </Text>
          </View>
        ))}
      </View>
      <View style={[styleSheet.cch_name, { flexWrap: "wrap" }]}>
        {monthDetails.map((day, i) => (
          <TouchableOpacity
            disabled={day.month !== 0 || onRestrictDay(day.date)}
            key={i}
            style={[
              styleSheet.dayBtn,
              isCurrentDay(day) && day.month === 0 && styleSheet.highlight,
              isSelectedDay(day) && day.month === 0 && styleSheet.selected,
            ]}
            testID={`d-${day.date}`}
            onPress={() => onDateClick(day)}
          >
            <View
              style={
                (day.month !== 0 || onRestrictDay(day.date)) && styleSheet.disabled
              }
            >
              <Text
                style={[
                    styleSheet.dayText,
                  isSelectedDay(day) &&
                    day.month === 0 && { color: colors.gray100 },
                ]}
              >
                {day.date}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  dayText: {
    fontSize: moderateScale(16),
    fontWeight: "400",
    color: colors.black,
  },
  cch_name: {
    flexDirection: "row",
    rowGap: 5,
    justifyContent: "space-between",
    maxWidth: moderateScale(330),
  },
  dayBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    alignItems: "center",
    justifyContent: "center",
  },
  highlight: {
    borderColor: "#0369F1",
    borderWidth: 1,
  },

  disabled: {
    opacity: 0.5,
  },

  selected: {
    backgroundColor: "#0369F1",
  },
});
