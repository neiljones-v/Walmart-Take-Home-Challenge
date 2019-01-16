angular.module("app.controllers", []);

app.controller("searchController", ($scope, $http) => {
  $scope.initalize = () => {
    $scope.loading = false;
    $scope.noResult = false;
    $scope.data = [];
    $scope.keyword = "";
    $scope.activeItem = [];
    $("#search").val("");
  };

  $scope.search = (keyword, showAll = false) => {
    if (showAll == false && keyword.trim() == "") {
      alert("Enter a keyword");
      return;
    }

    $scope.loading = true;
    $scope.noResult = false;
    $scope.keyword = keyword;
    $scope.activeItem = [];

    $scope
      .secureRequest()
      .then(response => {
        if (response.status == 200) {
          let authentication_token = response.data;
          $scope
            .searchKeyword(authentication_token, keyword)
            .then(searchResponse => {
              if (searchResponse.status == 200) {
                $scope.data = searchResponse.data;
                if ($scope.data.length == 0) $scope.noResult = true;
                $scope.loading = false;
                $scope.$apply();
              }
            })
            .catch(exception => {
              let errorMessage = "Error: " + exception.statusText;
              alert(errorMessage);
              $scope.loading = false;
              $scope.$apply();
            });
        }
      })
      .catch(exception => {
        alert("Cannot connect to the server");
        $scope.initalize();
        $scope.$apply();
      });
  };

  $scope.secureRequest = () => {
    return new Promise((resolve, reject) => {
      $http({
        method: "GET",
        url: "/api/token/create"
      }).then(
        function successCallback(response) {
          resolve(response);
        },
        function errorCallback(response) {
          reject(response);
        }
      );
    });
  };

  $scope.searchKeyword = (authentication_token, keyword) => {
    return new Promise((resolve, reject) => {
      $http({
        method: "GET",
        url: "/api/search",
        params: { keyword: keyword },
        headers: { Authorization: authentication_token }
      }).then(
        function successCallback(response) {
          resolve(response);
        },
        function errorCallback(response) {
          reject(response);
        }
      );
    });
  };

  $scope.rowSelect = id => {
    $scope.activeItem = [];
    $scope.data.forEach(item => {
      if (item.itemId == id) {
        if (item.active === undefined) item.active = true;
        else {
          item.active = !item.active;
        }

        if (item.active) $scope.activeItem = item;
      } else {
        item.active = false;
      }
    });
  };

  $scope.resetSearch = () => {
    $scope.initalize();
  };

  $scope.showAll = () => {
    $scope.search("", true);
  };
});
