// Import modules
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// Create Express application
const app = express();

// Define router
const categoriesRouter = require("./app/api/v1/categories/router");
const imagesRouter = require("./app/api/v1/images/router");
const talentsRouter = require('./app/api/v1/talents/router');
const eventsRouter = require('./app/api/v1/events/router');
const organizersRouter = require('./app/api/v1/organizers/router');
const authRouter = require('./app/api/v1/auth/router');

// Define middlewares
const notFoundMiddleware = require("./app/middlewares/not-found");
const handleErrorMiddleware = require("./app/middlewares/handler-error");

// Define v1 API version
const v1 = "/api/v1/cms";

// Use middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Define root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Wellcome to api semina aww",
  });
});

// Define v1 API routes
app.use(v1, talentsRouter);
app.use(v1, authRouter);
app.use(v1, organizersRouter);
app.use(v1, eventsRouter);
app.use(v1, imagesRouter);
app.use(v1, categoriesRouter);

// Use error handling middlewares
app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

// Export Express application
module.exports = app;
