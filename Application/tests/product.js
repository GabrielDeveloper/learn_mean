var assert = require('assert');
var mongoose = require('mongoose');

var productSchema = require('../schemas/product');

describe('Product Schemas Tests', function(){
    var Product = mongoose.model('Product', productSchema, 'products');
    var succeeded = 0;

    describe('Product', function () {
        it('has a name field that\' required string', function (){
            var product = new Product({});
            product.validate(function(err){
                assert.ok(err);
                assert.equal(err.errors['name'].kind, 'required');

                product.name = "IPhone";
                assert.equal(product.name, "IPhone");
                ++succeeded;
                done();
            });
        });

    });
});
