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


app.use('/css*', (req, res) => {
  res.sendFile(path.join(__dirname + req.originalUrl));
});


app.use('/fonts*', (req, res) => {
  res.sendFile(path.join(__dirname + req.originalUrl));
});

//html pages

app.get('/', (req, res) => {
  res.redirect('/home');
});

app.use('/login', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/home', (req, res) => {
  if(req.query.token) {
    token = req.query.token;
    //validate(token)
    console.log(token);
    if(token === 'invalid') {
      res.redirect('/login');
    } else {
      res.sendFile(__dirname + '/spa.html');
    }
    //res.redirect('/login');
  } else {
    res.sendFile(path.join(__dirname + '/loader.html'));
  }
  //res.sendFile(path.join(__dirname + '/loader.html'));
});

app.get('/subscribe', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/subscribe.html'));
});

app.get('/tutor', (req, res) => {
  res.sendFile(path.join(__dirname + '/views/selecTutor.html'));
});



module.exports = app;
