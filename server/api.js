module.exports = (app, config, request, fs, csv, async, utils) => {
  // API to search the keywords
  app.get("/api/search", async (req, res) => {
    let searchResult = [];
    try {
      // Get the item ids required to query the walmart API
      utils.getItemIds(fs, csv, config).then(itemIds => {
        // Create a unique list of IDs
        let uniqueIds = itemIds.filter((v, i, a) => a.indexOf(v) === i);

        // Creating subsets to query the walmart API from the list
        // based on limit defined in the config file
        let itemIdSubSets = utils.createSubsets(
          uniqueIds,
          config.api.walmart.limit
        );
        let items = [];
        async.each(
          itemIdSubSets,
          (itemIdList, callback) => {
            // Processing each subset
            utils
              .processSubset(itemIdList, request, config)
              .then(data => {
                data.items.forEach(item => {
                  items.push(item);
                });

                callback();
              })
              .catch(exception => {
                callback("error");
              });
          },
          err => {
            if (err) {
              // One of the iterations produced an error.
              res.status(500).send(err);
            } else {
              // Searching for the keyword from the result after processing all the subsets
              searchResult = utils.keywordSearch(items, req.query.keyword);
              res.status(200).send(searchResult);
            }
          }
        );
      });
    } catch (exception) {
      res.status(500).send(exception);
    }
  });

  // API to create a new token
  app.get("/api/token/create", (req, res) => {
    let token = utils.getToken();
    res.status(200).send(token);
  });
};
