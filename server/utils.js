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

// Reading the item ids from the csv file
utils.prototype.getItemIds = function(fs, csv, config) {
  return new Promise((resolve, reject) => {
    let itemIds = [];
    let inputStream = fs.createReadStream(config.files.itemIds, "utf8");

    inputStream
      .pipe(
        csv({
          parseNumbers: true,
          parseBooleans: true,
          trim: true
        })
      )
      .on("data", itemId => {
        itemIds.push(itemId[0]);
      })
      .on("end", () => {
        resolve(itemIds);
      });
  });
};

//  Creating a sublist based on the limit defined in the config file
utils.prototype.createSubsets = function(itemIds, limit) {
  let result = [];
  let i, j;
  for (i = 0, j = itemIds.length; i < j; i += limit) {
    result.push(itemIds.slice(i, i + limit));
  }
  return result;
};

// Processing the subset bu quering the item ids against the walmart API
utils.prototype.processSubset = function(itemIdList, request, config) {
  return new Promise((resolve, reject) => {
    let idQueryString = "";

    itemIdList.forEach(id => {
      if (idQueryString == "") idQueryString += id;
      else idQueryString += "," + id;
    });

    let request_url =
      "http://api.walmartlabs.com/v1/items?ids=" +
      idQueryString +
      "&apiKey=" +
      config.api.walmart.keys;

    try {
      request(request_url, (error, response, data) => {
        if (response.statusCode == 200) {
          resolve(JSON.parse(data));
        } else {
          reject(error);
        }
      });
    } catch (exception) {
      reject(exception);
    }
  });
};

// Search for the keyword
utils.prototype.keywordSearch = function(items, keyword) {
  let result = [];
  let self = this;
  items.forEach(item => {
    if (item.shortDescription !== undefined)
      item.shortDescription = self.stringCleanUp(item.shortDescription);
    if (item.longDescription !== undefined)
      item.longDescription = self.stringCleanUp(item.longDescription);

    if (
      item.longDescription !== undefined &&
      item.longDescription.toLowerCase().indexOf(keyword) >= 0
    )
      result.push(item);
    else if (
      item.shortDescription !== undefined &&
      item.shortDescription.toLowerCase().indexOf(keyword) >= 0
    ) {
      result.push(item);
    }
  });
  return result;
};

// Cleanup the result descriptions
utils.prototype.stringCleanUp = function(string) {
  let self = this;
  let result = "";

  // Case 1
  // Single quote
  let regex_1 = "&quot;";

  // Case 2
  // dash
  let regex_2 = "&mdash;";

  // Case 3
  // Non breakablse space
  let regex_3 = "&nbsp;";

  result = string
    .replaceAll(regex_1, '"')
    .replaceAll(regex_2, " - ")
    .replaceAll(regex_3, " ");

  return result;
};

// Extening the property of the string data type to replace characters based on a regular expression
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

module.exports = new utils();
