const jwt = require("jsonwebtoken");
const config = require("../config.json");

function utils() {}

// Returning the data from config.json
utils.prototype.getConfig = () => {
  return config;
};

// This function filters the resource requests made to the application
utils.prototype.skipLog = (req, res) => {
  var url = req.url;
  if (url.indexOf("?") > 0) url = url.substr(0, url.indexOf("?"));
  if (url.match(/(js|jpg|png|ico|css|woff|woff2|eot|map)$/gi)) {
    return true;
  }
  return false;
};

// Creating a token valid based on the duration specified in the config file
utils.prototype.getToken = function() {
  return jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + config.tokenExpiry,
      data: config.secret
    },
    config.secret
  );
};

module.exports = new utils();
