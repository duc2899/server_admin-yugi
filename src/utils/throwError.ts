interface CustomError extends Error {
    statusCode: number;
    returnCode?: number;
}

const throwError = (message: string, statusCode: number = 400, returnCode?: number) => {
    const error = new Error(message) as CustomError;

    error.statusCode = statusCode;
    error.returnCode = returnCode;
    throw error;
};

export default throwError;