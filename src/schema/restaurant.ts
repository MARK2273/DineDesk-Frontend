import { validationRules } from "@dine-desk/helper/validation";
import * as yup from "yup";

export const restaurantSchema = yup.object().shape({
  name: validationRules.string({
    fieldName: "name",
    required: true,
    requiredMessage: "Restaurant name is required",
    minLength: 3,
    minMessage: "Minimum 3 characters",
    trim: true,
  }),
  image: validationRules.array({
    fieldName: "image",
    required: true,
    requiredMessage: "Restaurant image is required",
  }),
});

export type RestaurantData = yup.InferType<typeof restaurantSchema>;
