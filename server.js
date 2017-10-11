var express = require('express');
var app = express();

app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/assets'));

var port = process.env.PORT || 8004;

app.listen(port);