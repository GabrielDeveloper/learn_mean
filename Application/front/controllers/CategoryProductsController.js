module.exports = function ($scope, $routeParams, $http) {
    var encoded = encodeURIComponent($routeParams.category);

    $scope.price = undefined;

    $scope.handlePriceClick = function () {
        if ($scope.price === undefined) {
            $scope.price = -1;
            return $scope.load();
        }
        $scope.price = 0 - $scope.price;
        return  $scope.load();
    };

    $scope.load = function () {
        var queryParams = { price : $scope.price};
        $http.
            get('/api/v1/product/category/' + encoded,  {params: queryParams}).
            success(function (data) {
                $scope.products = data.products;
            });

    };

    $scope.load();

    setTimeout(function() {
        $scope.$emit('CategoryProductsController');
    }, 0);
};
