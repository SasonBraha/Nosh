'use strict';
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  img: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const OrderSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    trim: true
  },
  fromIP: {
    type: String,
    trim: true
  },
  productRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  forProduct: ProductSchema,
  status: {
    type: String,
    default: 'ההזמנה בטיפול'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = module.exports = mongoose.model('Order', OrderSchema);