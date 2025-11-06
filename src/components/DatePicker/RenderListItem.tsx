import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { colors } from "@/theme";

interface IRenderItemProps {
  disabled?: boolean;
  item: any;
  selected: boolean;
  onPress: () => void;
  testID: string;
}

export default function RenderListItem({
  item,
  onPress,
  selected,
  disabled,
  testID,
}: IRenderItemProps) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.listItem,
        disabled && styles.itemDisabled,
        selected && styles.isSelected,
      ]}
      testID={testID}
      onPress={onPress}
    >
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  listItem: {
    height: 48,
    marginVertical: 2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: colors.gray200,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
  },
  isSelected: {
    borderColor: "#46C2A3",
    backgroundColor: colors.gray50,
  },
  itemDisabled: {
    opacity: 0.5,
  },
});
