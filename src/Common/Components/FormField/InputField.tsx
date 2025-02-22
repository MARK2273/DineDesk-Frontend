import clsx from "clsx";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import Icon, { IconNameType } from "../Icon";

export interface InputFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  error?: string;
  register: UseFormRegister<T>;
  type?: string;
  inputClass?: string;
  placeholder?: string;
  parentClassName?: string;
  inputParentClassName?: string;
  labelClass?: string;
  value?: string | number | undefined;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  icon?: IconNameType;
  iconClassName?: string;
  errorClass?: string;
  onIconClick?: () => void;
}

const InputField = <T extends FieldValues>({
  label,
  name,
  error,
  register,
  type = "text",
  inputClass = "",
  placeholder,
  disabled,
  parentClassName,
  labelClass,
  inputParentClassName,
  value,
  required,
  maxLength,
  icon,
  iconClassName,
  onIconClick,
  errorClass,
}: InputFieldProps<T>) => {
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
          type={type}
          disabled={disabled}
          {...(name && { name })}
          className={clsx(
            "w-full px-2.5 py-2.5 border border-solid border-Gray-200 rounded-md focus:outline-Primary-400 focus:outline-1 bg-Gray-400 text-Primary-900 text-base font-normal leading-5 placeholder:text-black/35 truncate",
            inputClass,
            { "!border-red-500 !mb-1.5": error }
          )}
          placeholder={placeholder}
          value={value}
          {...(register && name && register(name))}
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
};

export default InputField;
