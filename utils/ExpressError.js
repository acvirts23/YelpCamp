class ExpressError extends Error {
    constructor(message, statusCode) {
        //This calls the Error constructor
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;