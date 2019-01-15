var app = angular.module("app", ["ngRoute", "datatables"]);

// Client routing
app.config(function($routeProvider) {
  // Loading search.html when path - / is requested
  $routeProvider
    .when("/", {
      templateUrl: "views/search.html",
      controller: "searchController"
    })
    // Redirecting to the home page on an invalid path request
    .otherwise({
      redirectTo: "/"
    });
});
