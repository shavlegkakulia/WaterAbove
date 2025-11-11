import React from 'react';
import {Controller, Control, FieldValues, Path} from 'react-hook-form';
import {Input, InputProps} from '@/components/ui/Input';

export interface FormInputProps<T extends FieldValues>
  extends Omit<InputProps, 'value' | 'onChangeText' | 'state'> {
  control: Control<T>;
  name: Path<T>;
  errorMessage?: string;
  rules?: any;
  onChangeTextFilter?: (text: string) => string;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  rules,
  onChangeTextFilter,
  ...inputProps
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {onChange, onBlur, value}, fieldState: {error, isDirty, isTouched}}) => {
        const handleChangeText = (text: string) => {
          const filteredText = onChangeTextFilter ? onChangeTextFilter(text) : text;
          onChange(filteredText);
        };

        // Determine state: success if valid (no error), not empty, and has been touched/changed
        // error if there's an error; otherwise default
        const getInputState = () => {
          if (error) return 'error';
          // If value is valid (no error), not empty, and field has been touched or changed
          if ((isDirty || isTouched) && value && typeof value === 'string' && value.trim() !== '') {
            return 'success';
          }
          return 'default';
        };

        const handleBlur = (e: any) => {
          onBlur();
          inputProps.onBlur?.(e);
        };

        const handleFocus = (e: any) => {
          inputProps.onFocus?.(e);
        };

        return (
          <Input
            {...inputProps}
            value={value || ''}
            onChangeText={handleChangeText}
            onBlur={handleBlur}
            onFocus={handleFocus}
            state={getInputState()}
            errorMessage={error?.message}
            helpText={inputProps.helpText}
          />
        );
      }}
    />
  );
}

