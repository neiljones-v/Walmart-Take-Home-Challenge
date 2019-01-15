module.exports = (app, path) => {
    // Rendering client.html by default
    app.get("/", (req, res) => {
      res.sendFile("client.html", { root: path.join(__dirname, "../client") });
    });
};
  