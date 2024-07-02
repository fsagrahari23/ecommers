const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  total: {
    type: Number,
    
  },
  items: {
    type: [String],
    
  },
  customer: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    contact:{
      type:Number,
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
