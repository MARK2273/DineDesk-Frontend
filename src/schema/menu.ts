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

export const itemSchema = yup.object().shape({
  items: yup.array().of(
    yup.object().shape({
      name: yup.string().required("Item name is required"),
      price: yup.string().required("Price is required"),
      category: yup.string().required("Category is required"),
      description: yup.string().required("Description is required"),
      available: yup.boolean(),
    })
  ),
});

export type ItamData = yup.InferType<typeof itemSchema>;
