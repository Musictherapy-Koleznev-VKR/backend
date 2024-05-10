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
app.use('/uploads', express.static('uploads'));
app.use('/translations', express.static('translations'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('cors')());

app.use(function (req, res, next) {
  if (req.originalUrl.includes('/api/data/')) {
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

app.use('/api/auth', authRoute);
app.use('/api/profile', profileRoute);
app.use('/api/data', dataRoute);

app.use('/api/admin_panel', adminRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/log', logRoute);
app.use('/api/individual_playlist', individualPlaylistRoute);

app.use('/', express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

//
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build'));
// });

// app.use(express.static("client/build"));

const server = http.createServer(app);

module.exports = server;
