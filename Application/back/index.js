var express = require('express');
var wagner = require('wagner-core');

require('./models')(wagner);
require('./dependencies')(wagner);

var app = express();

wagner.invoke(require('./auth'), {app : app});

app.use('/api/v1', require('./api')(wagner));

app.use(express.static('../front/', { maxAge: 4 * 60 * 60 * 1000 /* 2hrs */ }));

app.listen(3001);
console.log('Listening on port 3001!');
