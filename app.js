var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/users');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/media*', (req, res) => {
  res.sendFile(path.join(__dirname + req.originalUrl));
});

app.use('/js*', (req, res) => {
  res.sendFile(path.join(__dirname + req.originalUrl));
});

//html pages

app.use('/login', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});



module.exports = app;
