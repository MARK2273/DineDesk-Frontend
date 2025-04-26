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
      name: validationRules.string({
        fieldName: "name",
        required: true,
        requiredMessage: "Item name is required",
        minLength: 3,
        minMessage: "Minimum 3 characters",
        trim: true,
      }),
      price: validationRules.string({
        fieldName: "price",
        required: true,
        requiredMessage: "Price is required",
        pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
        patternMessage: "Price must be a number with up to 2 decimal places",
      }),
      category: validationRules.string({
        fieldName: "category",
        required: true,
        requiredMessage: "Category is required",
        minLength: 3,
        minMessage: "Minimum 3 characters",
        trim: true,
      }),
      description: validationRules.string({
        fieldName: "description",
        required: true,
        requiredMessage: "Description is required",
        minLength: 3,
        minMessage: "Minimum 3 characters",
        trim: true,
      }),
      available: validationRules.boolean({
        fieldName: "available",
        required: false,
      }),
      image: validationRules.array({
        fieldName: "image",
        required: true,
        requiredMessage: "Item image is required",
      }),
    })
  ),
});

export type ItamData = yup.InferType<typeof itemSchema>;
