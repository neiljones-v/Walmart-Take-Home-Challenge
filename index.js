const path = require("path");
const utils = require("./server/utils");
const morgan = require("morgan");
const express = require("express");
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

// Route definitions
require("./server/routes.js")(app, path);

// API definitions
require("./server/api.js")(app, config, utils);

let server = app.listen(port, host, () => {
  console.log("\tApplication running on - " + host + ":" + port);
});

module.exports = server;
