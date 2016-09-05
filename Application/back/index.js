global.rootRequire = function(name) {
    return require(require('path').dirname(require.main.filename) + '/' + name);
}

var express = require('express');
var wagner = require('wagner-core');

rootRequire('models')(wagner);
rootRequire('dependencies')(wagner);

var app = express();

wagner.invoke(rootRequire('auth'), {app : app});

app.use('/api/v1', rootRequire('api/v1/api')(wagner));

app.use(express.static('../front/', { maxAge: 4 * 60 * 60 * 1000 /* 2hrs */ }));

app.listen(3001);
console.log('Listening on port 3001!');
