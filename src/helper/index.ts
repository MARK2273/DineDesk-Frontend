import { AxiosError } from "axios";
import { ErrorResponse } from "react-router-dom";

export const extractErrors = (error: ErrorResponse): string => {
  let message = "";

  if (error instanceof AxiosError) {
    message =
      error.response?.data?.message || error.message || error.toString?.();
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  if (typeof message === "object" && message !== null) {
    const errors: string[] = [];
    Object.values(message).forEach((errorMessages) => {
      errors.push(...(errorMessages as string[]));
    });
    return errors?.[0] || "Something went wrong";
  }

  return message || "Something went wrong";
};
