const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const app = express();

// 1) Define corsOptions once
const corsOptions = {
  origin: [

    'http://192.168.29.227:3000',
    'https://kanban-client-b8bj.onrender.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// 2) Handle all preflight requests with those options
app.options('*', cors(corsOptions));

// 3) Then apply CORS to all routes
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', require('./src/v1/routes'));

module.exports = app;