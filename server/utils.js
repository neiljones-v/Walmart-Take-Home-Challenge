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

module.exports = new utils();
