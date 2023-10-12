const { StatusCodes } = require('http-status-codes');
const CustomApiError = require('./custom-api-error');

class Unauthorized extends CustomApiError {
    constructor(message) {
        super(message);
        this.statusCodes = StatusCodes.FORBIDDEN;
    }
}

module.exports = Unauthorized;