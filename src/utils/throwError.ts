import { StatusCode } from "../constants/status-codes.";

interface CustomError extends Error {
    statusCode: StatusCode;
    returnCode?: number;
}

const throwError = (message: string, statusCode: StatusCode, returnCode?: number) => {
    const error = new Error(message) as CustomError;

    error.statusCode = statusCode;
    error.returnCode = returnCode;
    throw error;
};

export default throwError;