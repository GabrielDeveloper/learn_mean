var _ = require('underscore');

module.exports = function (components) {

    var controllers = {
        'UserMenuController' : require('./UserMenuController'),
        'ProductDetailsController' : require('./ProductDetailsController'),
        'CategoryTreeController' : require('./CategoryTreeController'),
        'CategoryProductsController' : require('./CategoryProductsController'),
        'CheckoutController' : require('./CheckoutController'),
        'AddToCartController' : require('./AddToCartController')
    };

    _.each(controllers, function(controller, name) {
        components.controller(name, controller);
    });

    return components;
}
