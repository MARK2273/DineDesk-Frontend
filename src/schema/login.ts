import { validationRules } from "@dine-desk/helper/validation";
import * as yup from "yup";

export type loginData = yup.InferType<typeof loginSchema>;

export const loginSchema = yup.object().shape({
  password: validationRules.string({
    fieldName: "password",
    nullable: false,
    required: true,
    requiredMessage: "Password is required.",
    trim: true,
    minLength: 8,
    minMessage: "Password must be at least 8 characters long.",
  }),
  email: validationRules.email({
    fieldName: "email",
    required: true,
    requiredMessage: "Email is required.",
    trim: true,
    nullable: false,
    format: yup.string().email("Invalid email format."),
    unique: true,
  }),
});

export type registerData = yup.InferType<typeof registerSchema>;

export const registerSchema = yup.object().shape({
  username: validationRules.string({
    fieldName: "username",
    required: true,
    requiredMessage: "Username is required.",
    trim: true,
    nullable: false,
  }),
  password: validationRules.string({
    fieldName: "password",
    nullable: false,
    required: true,
    requiredMessage: "Password is required.",
    trim: true,
    minLength: 8,
    minMessage: "Password must be at least 8 characters long.",
  }),
  email: validationRules.email({
    fieldName: "email",
    required: true,
    requiredMessage: "Email is required.",
    trim: true,
    nullable: false,
    format: yup.string().email("Invalid email format."),
    unique: true,
  }),
});
