class ApiError extends Error {
    constructor(message, statusCode, errorCode = null) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = true;
        this.errorCode = errorCode;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message, errorCode) {
        return new ApiError(message, 400, errorCode);
    }

    static unauthorized(message, errorCode) {
        return new ApiError(message, 401, errorCode);
    }

    static forbidden(message, errorCode) {
        return new ApiError(message, 403, errorCode);
    }

    static notFound(message, errorCode) {
        return new ApiError(message, 404, errorCode);
    }

    static conflict(message, errorCode) {
        return new ApiError(message, 409, errorCode);
    }

    static unprocessable(message, errorCode) {
        return new ApiError(message, 422, errorCode);
    }

    static tooManyRequests(message, errorCode) {
        return new ApiError(message, 429, errorCode);
    }

    static internal(message, errorCode) {
        return new ApiError(message, 500, errorCode);
    }
}

module.exports = ApiError;