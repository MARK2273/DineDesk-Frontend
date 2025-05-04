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

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(dateString).toLocaleString("en-IN", options);
};

// Define enum for order status
export enum OrderStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case OrderStatus.PREPARING:
      return "bg-blue-100 text-blue-800";
    case OrderStatus.COMPLETED:
      return "bg-green-100 text-green-800";
    case OrderStatus.CANCELLED:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
