import axios from "axios";

type ErrorResponse = {
  message?: string;
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage: string
) => {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    return error.response?.data?.message || fallbackMessage;
  }

  return fallbackMessage;
};
