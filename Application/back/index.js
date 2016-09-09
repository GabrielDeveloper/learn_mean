global.rootRequire = function(name) {
    return require(require('path').dirname(require.main.filename) + '/' + name);
}

var express = require('express');
var wagner = require('wagner-core');

rootRequire('models')(wagner);
rootRequire('dependencies')(wagner);

var app = express();

var fs = require('fs');
var accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log',{flags: 'a'});
app.use(require('morgan')('combined', {stream: accessLogStream}));

app.use(function(req, res, next) {
    res.append('Access-Control-Allow-Origin', req.headers.origin || "*");
    res.append('Access-Control-Allow-Credentials', 'true');
    res.append('Access-Control-Allow-Methods', ['GET', 'OPTIONS', 'PUT', 'POST']);
    res.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

wagner.invoke(rootRequire('auth'), {app : app});

app.use('/api/v1', rootRequire('api/v1/api')(wagner));

app.use(express.static('../front/', { maxAge: 4 * 60 * 60 * 1000 /* 2hrs */ }));

app.listen(3001);
console.log('Listening on port 3001!');
