import clsx from "clsx";
import React from "react";

interface RadioProps {
  id: string;
  label: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  labelPlacement?: "start" | "end";
  name?: string;
  value?: string;
  defaultChecked?: boolean;
  labelClass?: string;
  ParentClassName?: string;
  disabled?: boolean;
}

export const CheckboxField: React.FC<RadioProps> = ({
  id,
  label,
  checked,
  onChange,
  className,
  labelPlacement = "end",
  name,
  value,
  defaultChecked,
  labelClass,
  ParentClassName,
  disabled = false,
}) => {
  const renderLabel = () =>
    label ? (
      <label
        htmlFor={id}
        className={clsx(
          "text-base leading-18px cursor-pointer w-[calc(100%-30px)]",
          labelClass
        )}
      >
        {label}
      </label>
    ) : (
      <></>
    );
  return (
    <div
      className={`relative inline-flex items-center gap-2 ${ParentClassName}`}
    >
      {labelPlacement === "start" && renderLabel()}
      <input
        id={id}
        type="checkbox"
        name={name}
        value={value}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className={clsx("h-5 w-5 ", className)}
        defaultChecked={defaultChecked}
      />
      {labelPlacement === "end" && renderLabel()}
    </div>
  );
};

export default CheckboxField;
