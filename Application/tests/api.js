var URL_ROOT = 'http://localhost:3001';
var assert = require('assert');
var express = require('express');
var wagner = require('wagner-core');
var superagent = require('superagent');

describe('Category API', function(){
    var server;
    var Category;

    before(function(){
        var app = express();

        //Bootstrap server
        models = require('../models')(wagner);
        app.use(require('../api')(wagner));

        server = app.listen(3001);

        // Make Category model available in tests
        Category = models.Category;
    });

    after(function(){
        server.close();
    });

    beforeEach(function(done) {
        Category.remove({}, function(error) {
            assert.ifError(error);
            done();
        });
    });

    it('can load a category by id', function (done) {
        //Create a single category
        Category.create({ _id: 'Eletronics' }, function(error, doc) {
            assert.ifError(error);
            var url = URL_ROOT + '/category/id/Eletronics';

            //Make an HTTP request to localhost:3001/category/id/letronics
            superagent.get(url, function(error, res) {
                assert.ifError(error);
                var result;

                // And make sure we got { _id: 'Eletronics' } back
                assert.doesNotThrow(function (){
                    result = JSON.parse(res.text);
                });
                assert.ok(result.category);
                assert.equal(result.category._id, 'Eletronics');
                done();
            });
        });
    });

    it('can load all categories that have a certain parent', function(done) {
        var categories = [
            { _id: 'Eletronics'},
            { _id: 'Phones', parent: 'Eletronics'},
            { _id: 'Laptops', parent: 'Eletronics'},
            { _id: 'Bacon'}
        ];

        //Create 4 categories
        Category.create(categories, function(error, categories) {
            var url = URL_ROOT + '/category/parent/Eletronics';

            // Make an HTTP request to localhost:3001/category/parent/Eletronics
            superagent.get(url, function(error, res) {
                assert.ifError(error);
                var result;

                assert.doesNotThrow(function() {
                    result = JSON.parse(res.text);
                });
                assert.equal(result.categories.length, 2);
                done();
            });
        });
    });
});
