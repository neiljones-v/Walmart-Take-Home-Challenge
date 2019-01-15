angular.module("app.controllers", []);

// Search Controller
app.controller("searchController", function($scope) {
  // Initialization function
  $scope.initalize = () => {
    $scope.loading = false;
    $scope.data = [];
  };
});
