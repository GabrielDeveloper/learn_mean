var _ = require('underscore');

var components = angular.module('mean-retail.components', ['ng']);

require('./controllers/controllers')(components);
require('./directives/directives')(components);
require('./services/services')(components);

var app = angular.module('mean-retail', ['mean-retail.components', 'ngRoute']);

app.config(function($routeProvider) {
  $routeProvider.
    when('/', {
        template: '<search-bar></search-bar>'
    }).
    when('/checkout', {
        template: '<checkout></checkout>'
    }).
    when('/category/:category', {
        templateUrl: 'templates/category_view.html'
    }).
    when('/product/:id', {
      template: '<product-details></product-details>'
    });
});
