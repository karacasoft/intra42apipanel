class APIError extends Error {
    code: number;
    data: any;
    cause?: Error;
    constructor(code: number, data: any, message?: string, cause?: Error) {
        super(message);
        this.data = data;
        this.cause = cause;
        this.code = code;
    }
}

export default APIError;