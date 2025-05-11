interface CheckboxProps {
  id: string;
  label?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  labelPlacement?: "start" | "end";
  name?: string;
  value?: string;
  defaultChecked?: boolean;
  labelClass?: string;
  containerClass?: string;
  disabled?: boolean;
}

export const CheckboxField: React.FC<CheckboxProps> = ({
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
  containerClass,
  disabled = false,
}) => {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-3 group",
        disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
        containerClass
      )}
    >
      {labelPlacement === "start" && label && (
        <Label htmlFor={id} className={labelClass} disabled={disabled}>
          {label}
        </Label>
      )}

      <div className="relative">
        <input
          id={id}
          type="checkbox"
          name={name}
          value={value}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          defaultChecked={defaultChecked}
          className={clsx(
            "peer appearance-none h-5 w-5 rounded-md border-2 border-gray-300",
            "transition-colors duration-100 ease-in-out",
            "checked:bg-yellow-500 checked:border-yellow-500",
            "focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            className
          )}
        />
        <CheckIcon disabled={disabled} />
      </div>

      {labelPlacement === "end" && label && (
        <Label htmlFor={id} className={labelClass} disabled={disabled}>
          {label}
        </Label>
      )}
    </div>
  );
};

const Label: React.FC<{
  htmlFor: string;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ htmlFor, className, disabled, children }) => (
  <label
    htmlFor={htmlFor}
    className={clsx(
      "text-base text-gray-700",
      disabled ? "cursor-not-allowed" : "cursor-pointer",
      className
    )}
  >
    {children}
  </label>
);

const CheckIcon: React.FC<{ disabled?: boolean }> = ({ disabled }) => (
  <svg
    className={clsx(
      "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
      "w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100",
      disabled ? "text-gray-400" : "text-white"
    )}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default CheckboxField;
