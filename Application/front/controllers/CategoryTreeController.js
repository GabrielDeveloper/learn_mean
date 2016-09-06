module.exports = function ($scope, $routeParams, $http) {
  var encoded = encodeURIComponent($routeParams.category);

  $http.
    get('/api/v1/category/id/' + encoded).
    success(function(data) {
        $scope.category = data.category;
        $http.
            get('/api/v1/category/parent/' + encoded).
            success(function (data) {
                $scope.children = data.categories;
            });
    });

  setTimeout(function() {
    $scope.$emit('CategoryTreeController');
  }, 0);
};

