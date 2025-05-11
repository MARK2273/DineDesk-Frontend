import React from "react";
import Select, { ActionMeta, MultiValue, SingleValue } from "react-select";
import clsx from "clsx";

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
  menuPlacement?: "auto" | "bottom" | "top";
  isLoading?: boolean;
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
  menuPlacement = "auto",
  isLoading = false,
}) => {
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isDisabled ? "#f3f4f6" : "white",
      minHeight: "44px",
      borderRadius: "8px",
      borderColor: state.isFocused ? "#f59e0b" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 1px #f59e0b" : "none",
      padding: "0 8px",
      transition: "all 0.2s ease",
      "&:hover": {
        borderColor: state.isFocused ? "#f59e0b" : "#d1d5db",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      marginTop: "4px",
      zIndex: 10,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#fef3c7"
        : state.isFocused
        ? "#fffbeb"
        : "white",
      color: state.isSelected ? "#92400e" : "#1f2937",
      padding: "10px 16px",
      cursor: "pointer",
      fontSize: "14px",
      "&:active": {
        backgroundColor: "#fef3c7",
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#fef3c7",
      borderRadius: "6px",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#92400e",
      fontWeight: "500",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#92400e",
      ":hover": {
        backgroundColor: "#fde68a",
        color: "#92400e",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      color: "#6b7280",
      transition: "all 0.2s ease",
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null,
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: "#6b7280",
      ":hover": {
        color: "#92400e",
      },
    }),
  };

  return (
    <div className={clsx("w-full", className)}>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        placeholder={placeholder}
        isClearable={isClearable}
        isDisabled={isDisabled}
        isLoading={isLoading}
        styles={customStyles}
        menuPlacement={menuPlacement}
        classNamePrefix="react-select"
        className="react-select-container"
        components={{
          LoadingIndicator: () => (
            <div className="px-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500" />
            </div>
          ),
        }}
      />
    </div>
  );
};

export default CustomSelect;
