var _ = require('underscore');

module.exports = function (components) {

    var controllers = {
        'UserMenuController' : require('./UserMenuController'),
        'ProductDetailsController' : require('./ProductDetailsController'),
        'CategoryTreeController' : require('./CategoryTreeController'),
        'CategoryProductsController' : require('./CategoryProductsController')
    };

    _.each(controllers, function(controller, name) {
        components.controller(name, controller);
    });

    return components;
}
