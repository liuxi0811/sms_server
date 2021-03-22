var express = require('express');
var bodyParser = require('body-parser');
var router = require('./router.js');
var path = require('path');
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.engine('html',require('express-art-template'));
//开放资源
app.use('/public/',express.static(path.join(__dirname,'./public/')));
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')));
app.use(router);
app.listen(3000,function () {
    console.log('runing');
});