import * as React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";
import type { ControllerProps } from "react-hook-form";

export const Form = FormProvider;

type FormFieldContextValue = {
  name: string;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

interface FormFieldProps extends ControllerProps {
  name: string;
}

export function FormField({ ...props }: FormFieldProps) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

interface FormItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function FormItem({ children, style }: FormItemProps) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={[styles.formItem, style]}>{children}</View>
    </FormItemContext.Provider>
  );
}

interface FormLabelProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function FormLabel({ children, style }: FormLabelProps) {
  const { error } = useFormField();

  return (
    <Text style={[styles.formLabel, error && styles.formLabelError, style]}>
      {children}
    </Text>
  );
}

interface FormControlProps {
  children: React.ReactElement<any>;
}

export function FormControl({ children }: FormControlProps) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  // Clone element with proper props
  const additionalProps: any = {
    accessibilityDescribedBy: !error
      ? formDescriptionId
      : `${formDescriptionId} ${formMessageId}`,
    accessibilityInvalid: !!error,
  };

  return React.cloneElement(children, additionalProps);
}

interface FormDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function FormDescription({ children, style }: FormDescriptionProps) {
  const { formDescriptionId } = useFormField();

  return (
    <Text
      accessible
      accessibilityLabel={formDescriptionId}
      style={[styles.formDescription, style]}
    >
      {children}
    </Text>
  );
}

interface FormMessageProps {
  children?: React.ReactNode;
  style?: TextStyle;
}

export function FormMessage({ children, style }: FormMessageProps) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;

  if (!body) {
    return null;
  }

  return (
    <Text
      accessible
      accessibilityLabel={formMessageId}
      style={[styles.formMessage, style]}
    >
      {body}
    </Text>
  );
}

const styles = StyleSheet.create({
  formItem: {
    gap: 8,
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
  },
  formLabelError: {
    color: "#EF4444",
  },
  formDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  formMessage: {
    fontSize: 14,
    color: "#EF4444",
    lineHeight: 20,
  },
});
