'use strict';
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../helpers/keys');
const { ensureTokenIntegrity } = require('../helpers/global');
const { uploadMany, uploadSingle } = require('../helpers/global');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');


//------------------------------------//
//  Protect Route                     //
//------------------------------------//
router.use(ensureTokenIntegrity);

router.get('/src', (req, res) => {
  res.sendFile(path.resolve('private/manage.js'));
})

router.get('/', (req, res) => {
  res.render('manage');
});

router.get('/config', (req, res) => {
  res.json(config);
});

router.post('/config', (req, res) => {
  const { sendEmailTo, logoText, indexHeader, indexDesc } = req.body;
  config.sendEmailTo = sendEmailTo;
  config.logoText = logoText;
  config.indexHeader = indexHeader;
  config.indexDesc = indexDesc;
  fs.writeFile('./config.json', JSON.stringify(config, null, 2), err => {
    if (err) return res.status(500).json('הייתה בעיה בעדכון ההגדרות, אנא נסי שנית');
    return res.status(200).json(200);
  });
});

//------------------------------------//
//  Products                          //
//------------------------------------//
// Find All Prodcuts
router.get('/products', (req, res) => {
  Product.find().sort({createdAt: '-1'}).lean().then(foundProducts => res.json(foundProducts));
});

// Add New Product
router.post('/products', (req, res) => {
  uploadMany(req, res, (err) => {
    Product.create({
      name: req.body.name,
      images: req.files.map(img => `/uploads/${img.filename}`),
      price: req.body.price,
      desc: req.body.desc
    })
    .then(createdProduct => {
      res.status(200).json({status: 200, newProduct: createdProduct});
    })
    .catch(err => console.log);    
  });
});

// Delete Prodcut
router.delete('/prodcuts', (req, res) => {
  Product.findByIdAndRemove(req.body.id)
    .then(() => res.status(200).json(200))
    .catch(err => res.status(500).json('הייתה בעיה בביצוע בקשתך'));
});

//------------------------------------//
//  Orders                            //
//------------------------------------//
// Find All Requests
router.get('/orders/:query', (req, res) => {
  Order.find({status: req.params.query}).sort({createdAt: -1}).populate('productRef', '_id').lean().then(allOrders => {
    res.status(200).json(allOrders);
  });
});

// Change Request Status
router.put('/orders', (req, res) => {
  Order.findById(req.body.id).then(foundOrder => {
    foundOrder.status = req.body.status;
    foundOrder.save()
      .then(() => res.status(200).json(200))
      .catch(err => res.status(500).json(500));
  })
  .catch(err => res.status(500).json(500));
});

//------------------------------------//
//  Users                             //
//------------------------------------//
// Find All Users
router.get('/users', (req, res) => {
  User.find().sort({ createdAt: -1 }).lean().then(foundUser => res.status(200).json(foundUser));
});

// Create New User
router.post('/users', (req, res) => {
  uploadSingle(req, res, (err) => {
    User.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      avatar: `/uploads/${req.file.filename}`
    })
    .then(createdUser => res.status(200).json({status: 200, newUser: createdUser}))
    .catch(err => res.status(500).json({status: 500}));
  });
});

// Delete User
router.delete('/users', (req, res) => {
  User.findByIdAndRemove(req.body.id)
    .then(() => res.status(200).json(200))
    .catch(err => res.status(500).json('הייתה בעיה במחיקת המשתמש, אנא נסי שנית'));
});

// Render <manage> On Every Route
router.get('/*', (req, res) => {
  res.render('manage');
});

module.exports = router;