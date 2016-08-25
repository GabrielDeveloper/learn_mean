var express = require('express');
var status = require('http-status');

module.exports = function (wagner) {
    var api = express.Router();

    api.get('/product/id/:id', wagner.invoke(function(Product) {
        return function (req, res) {
            Product.findOne({ _id: req.params.id}, handleOne.bind(null, 'product', res));
        };
    }));

    api.get('/product/category/:id', wagner.invoke(function(Product) {
        return function (req, res) {
            var sort = { name: 1};
            if (req.query.price === "1") {
                sort = {'internal.approximatePriceUSD' : 1};
            } else if (req.query.price === "-1") {
                sort = {'internal.approximatePriceUSD' : -1};
            }

            Product.
                find({ 'category.ancestors': req.params.id }).
                sort(sort).
                exec(handleMany.bind(null, 'products', res));
        };
    }));

    api.get('/category/id/:id', wagner.invoke(function(Category) {
        return function (req, res) {
            Category.findOne({ _id: req.params.id},  handleOne.bind(null, 'category', res));
        };
    }));

    api.get('/category/parent/:id', wagner.invoke(function (Category){
        return function (req, res) {
            Category.
                find({ parent: req.params.id}).
                sort({ _id: 1}).
                exec(handleMany.bind(null, 'categories', res));
        };
    }));

    return api;
};

function handleOne(property, res, error, result) {
    if (error) {
        return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error : error.toString() });
    }
    if (!result) {
        return res.
            status(status.NOT_FOUND).
            json({ error: 'Not Found'});
    }

    var json = {};
    json[property] = result;
    res.json(json);
};

function handleMany(property, res, error, result){
    if (error) {
        return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error : error.toString() });
    }
    var json = {};
    json[property] = result;
    res.json(json);
};
