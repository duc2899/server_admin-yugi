export class ApiError extends Error {
    statusCode: number;
    returnCode: string;

    constructor(
        statusCode: number,
        message: string,
        returnCode = "UNKNOWN_ERROR"
    ) {
        super(message);
        this.statusCode = statusCode;
        this.returnCode = returnCode;

        Error.captureStackTrace(this, this.constructor);
    }
}