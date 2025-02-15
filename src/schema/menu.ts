import { validationRules } from "@dine-desk/helper/validation";
import * as yup from "yup";

// Define Yup validation schema
export const menuSchema = yup.object().shape({
  name: validationRules.string({
    fieldName: "name",
    required: true,
    requiredMessage: "Menu name is required",
    minLength: 3,
    minMessage: "Minimum 3 characters",
    trim: true,
  }),
});

export type MenuData = yup.InferType<typeof menuSchema>;
