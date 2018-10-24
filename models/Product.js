'use strict';
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  images: [],
  price: {
    type: String,
    required: true,
    trim: true
  },
  desc: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = module.exports = mongoose.model('Product', ProductSchema);