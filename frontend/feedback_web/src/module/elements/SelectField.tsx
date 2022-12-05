/* eslint-disable no-unused-vars */
import React from 'react';
import {
  FormControl,
  Select,
  SelectChangeEvent,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/system';

const FormControlField = styled(FormControl)(() => ({
  '& fieldset': {
    borderRadius: '10px',
  },
}));

type ItemOption = {
  key: string | number;
  label?: React.ReactNode;
  value: string | number;
};

type Option<TSelectValues> = {
  type: string;
  className?: string;
  value: TSelectValues;
  label?: string;
  handleChange: (event: SelectChangeEvent<TSelectValues>) => void;
  handleClick?: (arg1?: string) => void;
}

type SelectFieldProps<TSelectValues> = {
  selectItems: ItemOption[];
  option: Option<TSelectValues>;
  formStyle?: {[key: string]: number|string|object};
  menuProps?: {
    PaperProps: {
      style: {
        [key: string]: string|number
      }
    }
  };
};

const SelectField = <
  TSelectValues extends string | number | string[] | number[]
>({
    option,
    selectItems,
    formStyle,
    menuProps,
  }: SelectFieldProps<TSelectValues>) => {
  // const handleClick = option.handleClick
  //   ? option.handleClick
  //   : (arg1?: string) => console.log(arg1);

  return (
    <FormControlField sx={formStyle}>
      <InputLabel style={{ zIndex: 0 }}>
        {option.label}
      </InputLabel>
      <Select
        className={option.className}
        value={option.value}
        multiple={option.type === 'multiple'}
        label={option.label}
        onChange={option.handleChange}
        // onClick={() => handleClick()}
        MenuProps={menuProps}
        sx={{ color: 'text.secondary' }}
      >
        {selectItems.map((item) => (
          <MenuItem
            key={item.key}
            value={item.key}
          >
            {item.value}
          </MenuItem>
        ))}
      </Select>
    </FormControlField>
  );
};

SelectField.defaultProps = {
  formStyle: {
    m: 1,
    pl: 1,
    pr: 1,
    width: { xs: '100%', md: 400 },
    bgcolor: 'background.default',
  },
  menuProps: {
    PaperProps: {
      style: {
        maxHeight: 150,
        width: 250,
      },
    },
  },
};

export default SelectField;
