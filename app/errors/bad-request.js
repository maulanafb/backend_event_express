const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./custom-api-error");

class BadRequest extends CustomApiError {
  constructor(message) {
    super(message);
    // memberikan statusCode bad request
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequest;
