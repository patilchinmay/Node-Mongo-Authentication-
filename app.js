const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const morgan = require('morgan');

// Connect to mongodb
// const connectionURI = "mongodb://"+process.env.DB_USER+":"+process.env.DB_PWD+"@"+process.env.DB_HOST+"/"+process.env.DB_DB;
// mongoose.connect(connectionURI);

mongoose.connect("mongodb://localhost/database");

// 'mongodb://user:pwd@host:port/database'

mongoose.Promise = global.Promise;

// Morgan is a request logging tool
app.use(morgan('dev'));

// const userRoutes = require('./routes/users.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Handling CORS errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

// Routes which should handle requests
// app.use('/users', userRoutes);

// Serve static files
app.use('/', express.static('view/static/'));

// ping location
app.get('/ping', (req, res) => {
    res.send('pong\n');
  });

// Initialize routes
const userRoutes = require('./application/components/users/user_routes');
app.use('/user', userRoutes);

// Handle requests to invalid URLs and throw errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Handling all other errors e.g. a database error, where an error is already generated and passed as an argument
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;