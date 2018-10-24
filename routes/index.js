'use strict';
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret, mailConfig } = require('../helpers/keys');
const { transporter } = require('../helpers/global');
const fs = require('fs');
const config = require('../config.json');

// Index
router.get('/', (req, res) => {
  Product.find().sort({ createdAt: -1 }).lean().then(foundProducts => {
    res.render('index', { products: foundProducts, config });
  })
  .catch(err => res.send(err));
}); 

// Login Page
router.get('/login', (req, res) => {
  res.render('login');
});

// Login Process
router.post('/login', (req, res) => {
  const { username, password } = req.body; 
  const loginFailed = 'לא נמצא משתמש עם הנתונים שהזנת, אנא נסי שנית';
  const internalError = 'הייתה בעיה בניסיון ההתחברות, אנא נסי שנית';
  // Check If <username, password> Are Empty
  if (!username.length || !password.length) {
    res.status(400).json({ status: 400, resMsg: 'עלייך להזין שם משתמש וסיסמה על מנת להתחבר' });
  } else {
    // Check If Username Exists
    User.findOne({ username }).then(foundUser => {
      if (!foundUser) return res.status(403).json({ status: 403, resMsg: loginFailed });
      // Check Password
      bcrypt.compare(password, foundUser.password).then(result => {
        if (!result) return res.status(403).json({ status: 403, resMsg: loginFailed });
        // Create Token
        jwt.sign({ _id: foundUser._id }, jwtSecret, { expiresIn: '48h' }, (err, token) => {
          if (err) return res.status(500).json({ status: 500, resMsg: internalError });
          // Set Access Token
          res.cookie('accessToken', token, { httpOnly: true, sameSite: true, maxAge: 60 * 60 * 48 * 1000 });
          res.status(200).json({ status: 200, resMsg: '/manage/allProducts' });
        });
      })
        .catch(err => res.status(500).json({ status: 500, resMsg: internalError }));
    })
      .catch(err => res.status(500).json({ status: 500, resMsg: internalError }));
  }
});

// Create New Order
router.post('/orders', (req, res) => { 
  const errMsg = 'הייתה בעיה בביצוע בקשתך, אנא נסה/י שנית';
  const { productId, client, email, body } = req.body;
  // Validate
  if (!client.trim().length || !email.trim().length) return res.status(400).json('לא ניתן לבצע הזמנה ללא שם מלא וכתובת דואר אלקטרוני');
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim())) return res.status(400).json('כתובת דואר האלקטרוני שהוזנה אינה תקנית'); 
  Product.findById(productId).then(foundProduct => {
    if (!foundProduct) return res.status(400).json('המוצר שבחרת כבר לא קיים באתר, אנא בחרי אחר');
    Order.create({
      from: client,
      email,
      body,
      fromIP: req.ip,
      productRef: productId,
      forProduct: { name: foundProduct.name, img: foundProduct.images[0], price: foundProduct.price, originalID: foundProduct._id }
    })
    .then(createdOrder => {
      res.status(200).json(200);

      // // Send Mail
      // const mailOwner = config.sendEmailTo.split('@')[0];
      // let mailStruct = `
      //   <div>
      //     <div>היי ${mailOwner}, התקבלה הזמנה חדשה באתר, פרטי ההזמנה:</div>
      //     <ul>
      //       <li>התקבלה מאת: ${createdOrder.from}</li>
      //       <li>כתובת דואר אלקטרוני: ${createdOrder.email}</li>
      //       <li>עבור: ${createdOrder.forProduct.name}</li>
      //       <li>תוכן ההודעה: ${createdOrder.body.length ? createdOrder.body : 'השולח השאיר תיבה זו ריקה.'}</li>
      //     </ul>
      //     <div>לצפייה בכל ההזמנות היכנסי לקישור הבא: http://localhost:3000/manage/allOrders</div>
      //   </div>
      // `;
      // transporter.sendMail({
      //   from: `NOSH <${mailConfig.from}>`,
      //   to: config.sendEmailTo,
      //   subject: 'התקבלה הזמנה חדשה באתר',
      //   html: mailStruct
      // }, (err, info) => {
      //   if (err) console.log(err);
      // });
    })
    .catch(err => res.status(500).json(errMsg));
  })
  .catch(err => res.status(500).json(errMsg));
});

module.exports = router;