var token = "";
var fs = require("fs");
var assert = require("assert");
var config = require("../config.json");
var supertest = require("supertest");

// Testing to check for the existance of the configuration file
describe("Configuration file", function() {
  it("Application configuration file", function() {
    assert(fs.existsSync("./config.json"), true);
  });
});

// Checking to see if the Walmart API key is present in the configuration file
describe("API Key", function() {
  it("API key should be present in order to make API calls", function() {
    assert.notEqual(config.api.walmart.keys, "");
  });
});

// Checking to see if the API query limit is defined in the configuration file
describe("API query Limit", function() {
  it("The maximum number of items that can be queried at a time is 20", function() {
    assert.equal(config.api.walmart.limit, 20);
  });
});

// Checking to see if the walmart catalogue list is provided
describe("Walmart catalogue list", function() {
  it(".csv file containing the list of ids from the walmart catalogue", function() {
    assert.notEqual(config.files.itemIds, "");
  });
});

// Testing the server
describe("loading express", function() {
  let server;

  beforeEach(function() {
    server = require("../index");
  });

  afterEach(function() {
    server.close();
  });

  // Checking if the default path works
  it("responds to /", function testSlash(done) {
    supertest(server)
      .get("/")
      .expect(200, done);
  });

  // Testing the token create API
  it("Calling /api/token/create to create a token", function testSearch(done) {
    supertest(server)
      .get("/api/token/create")
      .end((err, res) => {
        token = res.text;
        done();
      });
  });

  // Creating a new token
  it("Calling /api/token/create to create a token", function testSearch(done) {
    supertest(server)
      .get("/api/token/create")
      .end((err, res) => {
        token = res.text;
        done();
      });
  });

  // Querying the search API with an invalid token
  it("Querying /api/search without an invalid token", function testSearch(done) {
    supertest(server)
      .get("/api/search")
      .set({ Authorization: "wrong token" })
      .expect(403, done);
  });

  // Querying the search API without any parameters
  it("Querying /api/search without any parameters", function testSearch(done) {
    supertest(server)
      .get("/api/search")
      .set({ Authorization: token })
      .end((err, res) => {
        assert.equal(res.body.length, 0);
        done();
      });
  });

  // Querying the search API with the keyword - backpack
  it("Querying /api/search with 'backpack'", function testSearch(done) {
    supertest(server)
      .get("/api/search?keyword=backpack")
      .set({ Authorization: token })
      .end((err, res) => {
        assert.equal(res.body.length, 3);
        done();
      });
  });

  // Testing for an invalid path
  it("Invalid path check", function testPath(done) {
    supertest(server)
      .get("/test")
      .expect(404, done);
  });
});
