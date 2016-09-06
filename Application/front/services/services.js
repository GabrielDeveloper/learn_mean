var status = require('http-status');
var _ = require('underscore');

module.exports = function(components) {

    var services = {
        "$user" : require('./user')
    };

    _.each(services, function(factory, name) {
        components.factory(name, factory);
    });

    return components;
};
