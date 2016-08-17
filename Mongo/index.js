var mongoose = require('mongoose');
var schema = require('./schema.js');

mongoose.connect('mongodb://localhost:27017/mean');

// Parameters are: model name, schema, collection name
var User = mongoose.model('User', schema, 'users');

var user = new User({
    name: 'Gabriel Goncalves',
    email: 'gabriel@teste.com'
});


var userFind = User.find({email: 'gabriel@teste.com'});
console.log(userFind.then());

console.log(user.email);
process.exit(1);

var promisse = user.save();
promisse.then(function(error){
    if (error) {
        console.log(error);
        process.exit(1);
    }

    var promisse = User.find({email: 'gabriel@teste.com'}); 
    promisse.then(function (error, doc) {
        if (error) {
            console.log(error);
            process.exit(1);
        }

        console.log(require('util').instect(doc));
        process.exit(0);
    });
});
