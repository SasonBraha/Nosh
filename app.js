'use strict';
const express = require('express');
const app = express();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const User = require('./models/User');

//------------------------------------//
//  Helmet Secuirty Model             //
//------------------------------------//
app.use(helmet());

//------------------------------------//
//    Mongooge & Data-Base Config     //
//------------------------------------//
// Set Mongoose Promise Library To Default ES6 Promise
mongoose.Promise = global.Promise;

// DB Connection Config
mongoose.connect('mongodb://localhost:27017/nosh', { useNewUrlParser: true }).catch(ex => { throw Error(ex) });

//------------------------------------//
//  Middlewares                       //
//------------------------------------//
// Set View Engine
app.set('view engine', 'pug');

// Serve Static Assets
app.use(express.static('public'));

app.use(cookieParser());

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//------------------------------------//
//  Routes                            //
//------------------------------------//
const manage = require('./routes/manage');
app.use('/manage', manage);

const index = require('./routes/index');
app.use('/', index);

//------------------------------------//
//  Initalize                         //
//------------------------------------//
const portNum = process.env.PORT || 3000;
app.listen(portNum, () => console.log(`Server Started On Port ${portNum}`));

