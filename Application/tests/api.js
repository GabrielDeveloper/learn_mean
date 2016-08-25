var URL_ROOT = 'http://localhost:3001';
var assert = require('assert');
var express = require('express');
var wagner = require('wagner-core');
var superagent = require('superagent');
var _ = require('underscore');

describe('Category API', function(){
    var server;
    var Category;
    var Product;

    before(function(){
        var app = express();

        //Bootstrap server
        models = require('../models')(wagner);
        app.use(require('../api')(wagner));

        server = app.listen(3001);

        // Make Category model available in tests
        Category = models.Category;
        Product = models.Product;
    });

    after(function(){
        server.close();
    });

    beforeEach(function(done) {
        var models = {
            Category: Category,
            Product: Product
        };

        _.each(models, function(value, key){
            value.remove({}, function(error) {
                assert.ifError(error);
            });
        });
        done();
    });

    it('can load a product by id', function (done) {
        var PRODUCT_ID = '000000000000000000000001';
        var product = {
            name: 'LG G4',
            _id: PRODUCT_ID,
            price: {
                amount: 300,
                currency: 'USD'
            },
        };

        Product.create(product, function(error, doc) {
            assert.ifError(error);
            var url = URL_ROOT + '/product/id/' + PRODUCT_ID;
            superagent.get(url, function(error, res) {
                assert.ifError(error);
                var result;

                assert.doesNotThrow(function() {
                    result = JSON.parse(res.text);
                });

                assert.ok(result);
                assert.equal(result.product._id, PRODUCT_ID);
                assert.equal(result.product.name, 'LG G4');
                done();
            });
        });
    });

    it('can load all products in a category with sub-categories', function(done) {
        var categories = [
            { _id: 'Eletronics'},
            { _id: 'Phones', parent: 'Eletronics'},
            { _id: 'Laptops', parent: 'Eletronics'},
            { _id: 'Bacon'}
        ];

        var products = [
            {
                name: 'LG G4',
                category: { _id: 'Phones', ancestors: ['Eletronics', 'Phones']},
                price: {
                    amount: 300,
                    currency: 'USD'
                }
            },
            {
                name: 'Asus Zenbook Prime',
                category: { _id: 'Laptops', ancestors: ['Eletronics', 'Laptops']},
                price: {
                    amount: 2000,
                    currency: 'USD'
                }
            },
            {
                name: 'Flying Pigs Farm Pasture Raised Pork Bacon',
                category: { _id: 'Bacon', ancestors: ['Bacon']},
                price: {
                    amount: 20,
                    currency: 'USD'
                }
            }
        ];

        // Create 4 categories
        Category.create(categories, function(error, categories) {
            assert.ifError(error);

            // And 3 products
            Product.create(products, function(error, products) {
                assert.ifError(error);
                var url = URL_ROOT + '/product/category/Eletronics';
                superagent.get(url, function(error, res) {
                    assert.ifError(error);
                    var result;
                    assert.doesNotThrow(function() {
                        result = JSON.parse(res.text);
                    });
                    assert.equal(result.products.length, 2);

                    // Should be in ascending order by name
                    assert.equal(result.products[0].name, 'Asus Zenbook Prime');
                    assert.equal(result.products[1].name, 'LG G4');

                    // Sort by price, ascending
                    var url = URL_ROOT + '/product/category/Eletronics?price=1';
                    superagent(url, function(error, res) {
                        assert.ifError(error);
                        var result;
                        assert.doesNotThrow(function() {
                            result = JSON.parse(res.text);
                        });
                        assert.equal(result.products.length, 2);

                        //Should be in acending order by precco
                        assert.equal(result.products[0].name, 'LG G4');
                        assert.equal(result.products[1].name, 'Asus Zenbook Prime');
                        done();
                    });
                });
            });
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

                assert.equal(result.categories[0]._id, 'Laptops');
                assert.equal(result.categories[1]._id, 'Phones');
                done();
            });
        });
    });
});
