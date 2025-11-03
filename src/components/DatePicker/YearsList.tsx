import React, { useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { FlatList } from "react-native";
import { colors } from "@/theme";
import RenderListItem from "./RenderListItem";
import { yearsMap } from "./helpers";

type TYearsListProps = {
  currentMonth: number;
  currentYear: number;
  maxMonth?: number;
  maxYear?: number;
  onSelectYear: (year: number) => void;
};
export default function YearsList({
  maxYear,
  currentYear,
  currentMonth,
  maxMonth,
  onSelectYear,
}: TYearsListProps) {
  const YearsListRef = useRef<FlatList<number>>(null);

  const scrollToYear = useCallback(() => {
    if (Platform.OS === "android") {
      const index = yearsMap(maxYear).indexOf(currentYear);
      YearsListRef?.current?.scrollToIndex({
        index: index,
        animated: false,
      });
    }
  }, [maxYear, currentYear]);
  const renderItem = useCallback(
    ({ item }: { item: number }) => (
      <RenderListItem
        disabled={item === maxYear && currentMonth > maxMonth!}
        item={item}
        selected={currentYear === item}
        testID={`y-${item}`}
        onPress={() => onSelectYear(item)}
      />
    ),
    [maxYear, currentMonth, maxMonth, currentYear, onSelectYear]
  );

  useEffect(() => {
    if (currentYear) scrollToYear();
  }, [currentYear, scrollToYear]);

  return (
    <FlatList
      contentContainerStyle={{ backgroundColor: colors.white }}
      data={yearsMap(maxYear)}
      initialScrollIndex={yearsMap(maxYear).indexOf(currentYear)}
      keyExtractor={(item) => item.toString()}
      ref={YearsListRef}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
}
