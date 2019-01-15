module.exports = (app, config, utils) => {
  app.get("/api/token/create", (req, res) => {
    let token = utils.getToken();
    res.status(200).send(token);
  });
};
