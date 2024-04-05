export class InvalidDataError extends Error {
    constructor(message: string) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidDataError.prototype);

        // Set the error name to the class name.
        this.name = this.constructor.name;

        // Capture the stack trace for the custom error.
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
