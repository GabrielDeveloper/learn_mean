module.exports = function($scope, $http, $user) {
    $scope.user = $user;
    $scope.updateCart = function () {
        $http.
            put('/api/v1/me/cart', $user.user).
            success(function(data) {
                $scope.updated = true;
            });
    }

    Stripe.setPublishableKey('pk_test_KVC0AphhVxm52zdsM4WoBstU');

    $scope.stripeToken = {
        number: '4242424242424242',
        cvc: '123',
        exp_month: '12',
        exp_year: '2016'
    };

    $scope.checkout = function() {
        Stripe.card.createToken($scope.stripeToken, function(status, response) {
        if (status.error) {
            $scope.error = status.error;
            return;
        }

        $http.
            post('/api/v1/checkout', { stripeToken: response.id }).
            success(function(data) {
                $scope.checkedOut = true;
                $user.user.data.cart = [];
            });
        });
    };


    setTimeout(function() {
        $scope.$emit('CheckoutController');
    }, 0);
};
