import React from 'react';
import {Controller, Control, FieldValues, Path} from 'react-hook-form';
import {Input, InputProps} from '@/components/Input';

export interface FormInputProps<T extends FieldValues>
  extends Omit<InputProps, 'value' | 'onChangeText' | 'state' | 'helpText'> {
  control: Control<T>;
  name: Path<T>;
  rules?: any;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  rules,
  ...inputProps
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
        <Input
          {...inputProps}
          value={value || ''}
          onChangeText={onChange}
          onBlur={onBlur}
          state={error ? 'error' : 'default'}
          helpText={error?.message}
        />
      )}
    />
  );
}

