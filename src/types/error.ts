import { AxiosError } from "axios";

interface ErrorData {
  message?: ErrorMessages,
}
type ResError = AxiosError<ErrorData>

enum ErrorMessages {
  noData="No data",
  userExists="User exists",
  userNotExists="No such user",
  badPassword="Bad password",
}

export { ErrorMessages };
export type { ResError };
