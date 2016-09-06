var _ = require('underscore');

module.exports = function (components) {

    var directives = {
        "userMenu" : require('./userMenu'),
        "productDetails" : require('./productDetails'),
        "categoryTree" : require('./categoryTree'),
        "categoryProducts" : require('./categoryProducts')
    };

    _.each(directives, function(directive, name) {
        components.directive(name, directive);
    });

    return components;
};
