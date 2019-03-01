const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");

const Socket = require('./socket');

const userRouters = require('./routers/userRouters');
const roomRouters = require('./routers/roomRouters');

const app = express();

// Set socket io 
Socket.init(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/users', userRouters);
app.use('/rooms', roomRouters);

module.exports = app;
