'use strict';
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const { jwtSecret, mailConfig } = require('../helpers/keys');
const User = require('../models/User');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

module.exports = {
  generateToken() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(48, (err, buf) => {
        if (!err) {
          resolve(buf.toString('base64').replace(/\W/g, ''));
        } else {
          reject(`Some Error Occurred: ${err}`);
        }
      });
    });
  },

  // Multer
  uploadMany: multer({
    storage: multer.diskStorage({
      destination: './public/uploads/',
      filename: async (req, file, cb) => {
        cb(null, `${await module.exports.generateToken()}${path.extname(file.originalname)}`);
      }
    })
  })
  .array('img', 5),

  uploadSingle: multer({
    storage: multer.diskStorage({
      destination: './public/uploads/',
      filename: async (req, file, cb) => {
        cb(null, `${await module.exports.generateToken()}${path.extname(file.originalname)}`);
      }
    })
  })
  .single('img'),

  ensureTokenIntegrity(req, res, next) {
    // Check If Token Exists
    if (!req.cookies.accessToken) {
      res.redirect('/login')
    } else {
      // Verify Token Integrity
      jwt.verify(req.cookies.accessToken, jwtSecret, (err, authData) => {
        if (err) return res.redirect('/login');
        // Ensure User Exists In DB
        User.findById(authData._id, '-password').then(foundUser => {
          if (!foundUser) {
            res.redirect('/login');
          } else {
            // Send User Data
            res.locals.user = foundUser;
            next();
          }
        });
      });
    }
  },

  // // Mail Config
  // transporter: nodemailer.createTransport({
  //   host: mailConfig.host,
  //   port: mailConfig.port,
  //   secure: true,
  //   auth: {
  //     user: mailConfig.username,
  //     pass: mailConfig.password
  //   },
  //   tls: {
  //     rejectUnauthorized: false
  //   }
  // }),

}