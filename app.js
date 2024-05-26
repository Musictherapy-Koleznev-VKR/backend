const express = require('express');
const fs = require('fs');
// const mongoose = require("mongoose");
const passport = require('passport');
const bodyParser = require('body-parser');
const path = require('path');

const authRoute = require('./src/api/auth');
const profileRoute = require('./src/api/profile');
const dataRoute = require('./src/api/data');
const adminRoute = require('./src/api/admin');
const uploadRoute = require('./src/api/upload');
const logRoute = require('./src/api/log');
const individualPlaylistRoute = require('./src/api/individualPlaylist');
const connectToDB = require('./database/db');

const http = require('http');
const app = express();

connectToDB();

app.use(passport.initialize());
require('./src/middleware/passport')(passport);

app.use(require('morgan')('dev'));
app.use('/koleznev/uploads', express.static('uploads'));
app.use('/koleznev/translations', express.static('translations'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('cors')());

app.use(function (req, res, next) {
  if (req.originalUrl.includes('/koleznev/api/data/')) {
    const date = new Date();
    const data =
      date.toUTCString() +
      ' [' +
      req.method +
      '] ' +
      req.originalUrl +
      ' (Authorization: ' +
      req.headers['authorization'] +
      ');\n';
    fs.appendFile('logger.txt', data, function (error) {
      if (error) {
        return console.log(error);
      }
    });
  }
  next();
});

app.use('/koleznev/api/auth', authRoute);
app.use('/koleznev/api/profile', profileRoute);
app.use('/koleznev/api/data', dataRoute);

app.use('/koleznev/api/admin_panel', adminRoute);
app.use('/koleznev/api/upload', uploadRoute);
app.use('/koleznev/api/log', logRoute);
app.use('/koleznev/api/individual_playlist', individualPlaylistRoute);

app.use('/koleznev/', express.static(path.join(__dirname, 'client', 'build')));

app.get('/koleznev/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.get('/koleznev/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build'));
});

app.use(express.static('client/build'));

const server = http.createServer(app);

module.exports = server;
