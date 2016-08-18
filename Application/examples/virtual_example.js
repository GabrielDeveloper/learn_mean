var schema = require('./schemas/product');
var mongoose = require('mongoose');

var Product = mongoose.model('Product', schema, 'products');

var p = new Product({
    name : 'test',
    price : {
        amount: 5,
        currency: 'USD'
    },
    category: {
        name: 'test'
    }
});

console.log(p.displayPrice);

p.price.amount = 20;
console.log(p.displayPrice);
