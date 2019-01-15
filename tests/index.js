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
});
