import { ChangeEventHandler, useState } from "react";
import { FieldValues } from "react-hook-form";
import InputField, { InputFieldProps } from "./InputField";
interface PasswordFieldProps<TFormValues extends FieldValues>
  extends InputFieldProps<TFormValues> {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  label: string;
  labelClass?: string;
  inputClass?: string;
  required?: boolean;
  parentClassName?: string;
}

export const PasswordField = <TFormValues extends Record<string, unknown>>(
  props: Omit<PasswordFieldProps<TFormValues>, "type">
) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <InputField
      inputClass={props.inputClass} // Ensures text doesn't overlap the icon
      {...props}
      type={show ? "text" : "password"}
      icon={show ? "passwordVisible" : "passwordEye"}
      onIconClick={() => setShow(!show)}
    />
  );
};

export default PasswordField;
