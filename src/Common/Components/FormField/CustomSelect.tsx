import React from "react";
import Select, { ActionMeta, MultiValue, SingleValue } from "react-select";

export interface OptionType {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: OptionType[];
  value?: OptionType | OptionType[] | null;
  onChange: (
    newValue: MultiValue<OptionType> | SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => void;
  isMulti?: boolean;
  placeholder?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  isMulti = false,
  placeholder = "Select...",
  isClearable = true,
  isDisabled = false,
  className = "",
}) => {
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "#f0f8ff",
      borderRadius: "8px",
      borderColor: state.isFocused ? "#007bff" : "#87ceeb",
      boxShadow: state.isFocused ? "0 0 5px rgba(0, 123, 255, 0.5)" : "none",
      padding: "4px",
      transition: "all 0.2s ease",
      width: "100%",
      minWidth: "200px",
      maxWidth: "400px",
      "@media (max-width: 600px)": {
        minWidth: "100px",
      },
      "&:hover": {
        borderColor: "#007bff",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#f0f8ff",
      borderRadius: "8px",
      boxShadow: "0px 4px 6px rgba(0, 0, 139, 0.1)",
      width: "100%",
      minWidth: "200px",
      maxWidth: "400px",
      "@media (max-width: 600px)": {
        minWidth: "100px",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#007bff"
        : state.isFocused
        ? "#cce5ff"
        : "#f0f8ff",
      color: state.isSelected ? "#fff" : "#333",
      padding: "10px 15px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#cce5ff",
      },
    }),
  };

  return (
    <Select
      options={options}
      value={value}
      onChange={(newValue, actionMeta) => onChange(newValue, actionMeta)}
      isMulti={isMulti}
      placeholder={placeholder}
      isClearable={isClearable}
      isDisabled={isDisabled}
      styles={customStyles}
      className={className}
    />
  );
};

export default CustomSelect;
