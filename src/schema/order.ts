import { validationRules } from "@dine-desk/helper/validation";
import * as yup from "yup";

export type OrderFormData = yup.InferType<typeof orderSchema>;

export const orderSchema = yup.object({
  restaurantId: validationRules.number({
    fieldName: "restaurantId",
    required: true,
    requiredMessage: "Restaurant ID is required",
    typeErrorMessage: "Restaurant ID must be a number",
  }),

  items: yup
    .array()
    .of(
      yup.object().shape({
        itemId: validationRules.number({
          fieldName: "itemId",
          required: true,
          requiredMessage: "Item ID is required",
          typeErrorMessage: "Item ID must be a number",
        }),

        quantity: validationRules.number({
          fieldName: "quantity",
          required: true,
          requiredMessage: "Quantity is required",
          typeErrorMessage: "Quantity must be a number",
          min: 1,
          minMessage: "Quantity must be greater than 0",
        }),
      })
    )
    .min(1, "At least one item is required")
    .required("Items are required"),
});
