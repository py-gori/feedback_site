/* eslint-disable no-unused-vars */
import React from 'react';
import {
  useForm,
  UseFormReturn,
  SubmitHandler,
  UseFormProps,
} from 'react-hook-form';

// https://github.com/alan2207/bulletproof-react/blob/master/src/components/Form/Form.tsx

type FormProps<TFormValues> = {
  className?: string;
  onSubmit: SubmitHandler<TFormValues>;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
}

const Form = <
  TFormValues extends Record<string, unknown> = Record<string, unknown>
>({
    onSubmit,
    children,
    className,
    options,
    id,
  }: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({ ...options });
  return (
    <form
      encType="multipart/form-data"
      className={className}
      onSubmit={methods.handleSubmit(onSubmit)}
      id={id}
    >
      {children(methods)}
    </form>
  );
};

Form.defaultProps = {
  className: '',
  id: '',
  options: '',
};

export default Form;
