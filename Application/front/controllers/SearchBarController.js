module.exports = function ($scope, $http) {
    $scope.update = function() {
        var encoded = encodeURIComponent($scope.searchText);
        if (encoded.length <= 0) {
            return $scope.results = {};
        }
        $http.
            get('/api/v1/product/text/' + encoded).
            success(function(data) {
                $scope.results = data.products;
            });
    };

    setTimeout(function() {
        $scope.$emit('SearchBarController');
    }, 0);
};
