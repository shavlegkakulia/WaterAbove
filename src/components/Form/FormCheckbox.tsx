import React from 'react';
import {Controller, Control, FieldValues, Path} from 'react-hook-form';
import {Checkbox, CheckboxProps} from '@/components/Checkbox';
import {Text} from '@/components/Typography';
import {View, StyleSheet} from 'react-native';
import {spacing} from '@/theme';

export interface FormCheckboxProps<T extends FieldValues>
  extends Omit<CheckboxProps, 'checked' | 'onPress'> {
  control: Control<T>;
  name: Path<T>;
  rules?: any;
}

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  rules,
  ...checkboxProps
}: FormCheckboxProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <View>
          <Checkbox
            {...checkboxProps}
            checked={!!value}
            onPress={() => onChange(!value)}
          />
          {error && (
            <Text
              variant="caption12Regular"
              color="error"
              style={styles.errorText}>
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  errorText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xl,
  },
});

