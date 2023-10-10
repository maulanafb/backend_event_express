const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./custom-api-error");

class NotFound extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCodes = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFound;
