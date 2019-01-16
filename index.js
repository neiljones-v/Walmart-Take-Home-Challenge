const fs = require("fs");
const path = require("path");
const async = require("async");
const csv = require("csv-reader");
const morgan = require("morgan");
const request = require("request");
const express = require("express");
const utils = require("./server/utils");
const bodyParser = require("body-parser");

const app = express();

// Getting the configration settings
const config = utils.getConfig();
const port = process.env.PORT || config.port;
const host = process.env.HOST || config.host;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Serving static files from /client
app.use(express.static(__dirname + "/client"));

// Logging requests made to the application
app.use(morgan("short", { skip: utils.skipLog }));

// Middleware to validate all the requests made to the application
app.use(utils.validate);

// Route definitions
require("./server/routes.js")(app, path);

// API definitions
require("./server/api.js")(app, config, request, fs, csv, async, utils);

let server = app.listen(port, host, () => {
  console.log("\tApplication running on - " + host + ":" + port);
});

module.exports = server;
