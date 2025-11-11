import React, { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { colors } from "@/theme";

import { monthMap } from "./helpers";
import { moderateScale } from "@/utils";

type TMonthListProps = {
  maxYear?: number;
  maxMonth?: number;
  currentYear: number;
  currentMonth: number;
  onSelectMonth: (month: number) => void;
};
export default function MonthList({
  currentMonth,
  currentYear,
  maxYear,
  maxMonth,
  onSelectMonth,
}: TMonthListProps) {

  const isDisabled = useCallback(
    (index: number) => {
      if (maxMonth && maxYear) {
        return maxMonth! < index && maxYear! <= currentYear;
      }
      return false;
    },
    [currentYear, maxYear, maxMonth]
  );

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {monthMap.map((item, index) => (
        <TouchableOpacity
          disabled={isDisabled(index)}
          key={index}
          style={[
            styles.item,
            index === currentMonth && styles.isSelected,
            isDisabled(index) && styles.isDisabled,
          ]}
          testID={`m-${index}`}
          onPress={() => onSelectMonth(index)}
        >
          <Text style={styles.monthLabel}>
            {item.long['en']}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: moderateScale(280),
    flexShrink: 0,
  },
  container: {
    paddingVertical: moderateScale(12),
    gap: moderateScale(8),
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  item: {
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(4),
    minWidth: "31%",
    minHeight: moderateScale(60),
    borderWidth: 1,
    borderRadius: 6,
    borderColor: colors.gray200,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  monthLabel: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "400",
    color: colors.gray600,
  },
  isSelected: {
    borderColor: "#46C2A3",
    backgroundColor: colors.gray50,
  },
  isDisabled: {
    opacity: 0.5,
  },
});
