module.exports = function ($scope, $http, $user) {
    $scope.addToCart = function (product) {
        var data = {data : {cart: [{product: product._id, quantity: product.quantity}]}};
        $scope.success = false;
        $http.
            put('/api/v1/me/cart', data).
            success(function (data) {
                $scope.user = data.user;
                $user.loadUser();
                $scope.success = true;
            });
    };
};
