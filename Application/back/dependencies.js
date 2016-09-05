var fs = require('fs');
var Stripe = require('stripe');
var fx = require('./schemas/fx');

module.exports = function(wagner) {
    var Config = wagner.factory('Config', function() {
        return JSON.parse(fs.readFileSync('./config.json').toString());
    });

    var stripe =  wagner.factory('Stripe', function(Config){
        return Stripe(Config.stripeKey);
    });

    wagner.factory('fx', fx);
};
