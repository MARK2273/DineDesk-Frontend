import clsx from "clsx";
import {
  ChangeEventHandler,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  forwardRef,
} from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import Icon, { IconNameType } from "../Icon";

export interface InputFieldProps<TFormValues extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type: HTMLInputTypeAttribute;
  label?: string;
  labelClass?: string;
  required?: boolean;
  icon?: IconNameType;
  onIconClick?: () => void;
  register?: UseFormRegister<TFormValues>; //fix
  inputClass?: string;
  parentClassName?: string;
  inputParentClassName?: string;
  value?: string | number | undefined;
  disabled?: boolean;
  name?: Path<TFormValues>;
  error?: string;
  errorClass?: string;
  multiple?: boolean | undefined;
  accept?: string;
  maxLength?: number;
  iconClassName?: string;
}

export const InputField = forwardRef(
  <TFormValues extends FieldValues>(
    fieldProps: InputFieldProps<TFormValues>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const {
      onChange,
      placeholder,
      type,
      label,
      labelClass,
      required,
      icon,
      onIconClick,
      register,
      inputClass,
      parentClassName,
      inputParentClassName,
      value,
      disabled = false,
      name = "",
      error,
      errorClass,
      multiple,
      accept,
      maxLength,
      iconClassName,
      autoComplete = "off",
      ...otherProps
    } = fieldProps;

    return (
      <div className={clsx("relative", parentClassName)}>
        {label && (
          <label
            className={clsx(
              "text-Primary-900 text-base font-normal leading-18px",
              labelClass
            )}
          >
            {label}{" "}
            {required && (
              <span className="text-Red-500 font-bold text-lg">*</span>
            )}
          </label>
        )}
        <div className={clsx("relative", inputParentClassName)}>
          <input
            {...otherProps}
            type={type}
            disabled={disabled}
            accept={accept}
            multiple={multiple}
            ref={ref}
            {...(name && { name })}
            className={clsx(
              "w-full px-2.5 py-2.5 border border-solid border-Gray-200 rounded-md focus:outline-Primary-400 focus:outline-1 bg-Gray-400 text-Primary-900 text-base font-normal leading-5 placeholder:text-black/35 truncate",
              inputClass,
              { "!border-red-500 !mb-1.5": error }
            )}
            placeholder={placeholder}
            value={value}
            autoComplete={autoComplete}
            onChange={onChange}
            {...(register && name && register(name, { onChange }))}
            maxLength={maxLength} // Apply maxLength from props
          />
          {icon && (
            <div
              className={clsx(
                "absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer",
                iconClassName
              )}
              onClick={onIconClick}
            >
              <Icon name={icon} />
            </div>
          )}
          {error && (
            <p className={`helper__text text-xs text-red-500 ${errorClass} `}>
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

export default InputField;
