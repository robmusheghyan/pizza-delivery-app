/**
 * third party libraries
 */
const bodyParser = require("body-parser");
const express = require("express");
const ejwt = require("express-jwt");
const http = require("http");
const cors = require("cors");
const logger = require("morgan");
/**
 * server configuration
 */
const config = require("../config/");
const dbInit = require("./init/db.init");
const { writeStatus } = require("./utils/server");
// environment: development, staging, testing, production
const environment = 'development';

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const DB = dbInit(environment, config.migrate).start();
const router = require("../api/routing");

// allow cross origin requests
// configure to only allow requests from certain origins
app.use(cors());
app.options("*", cors());
app.disable("x-powered-by");
app.use(logger("dev"));
app.use(cors());

// parsing the request bodys
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
router(app);

app.get("/", (req, res) => {
  res.send("Meal Delivery app server running");
});

app.use((err, req, res, next) => {
  if (err.code === "permission_denied") {
    writeStatus(res, true, {
      status: config.UnauthorizedError,
      message: "Error with getting data, please recheck your permissions."
    });
  } else {
    writeStatus(res, true, {
      status: err.statusCode ? err.statusCode : config.ServerError,
      message: err.message
    });
  }
});

app.get("*", (req, res) => {
  writeStatus(res, true, {
    status: config.NotFoundStatus,
    message: "Not found."
  });
});

server.listen(config.port, () => {
  if (
    environment !== "production" &&
    environment !== "development" &&
    environment !== "testing"
  ) {
    console.error(
      `NODE_ENV is set to ${environment}, but only production and development are valid.`
    );
    process.exit(1);
  }
  return DB;
});

module.exports = app;
