const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema= new Schema({
  fullname: {
    type: String,
    minlength: 3,
    trim: true
  },
  email: String,
  password: String,
  quantity:{
    type:Number,
    default: 0,
  },
  cart:[{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
    },
    quantity:{
      type:Number,
      default: 0,
      }

  }],
  orders:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  }],
  ratedProducts: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    rating: {
      type: Number
    }
  }],
  address:{
    type: String,
    default: 'No address'
  },
  contactNumbers: [{
    type:Number,
    default: 0
  }],
  Image: {
    type: String,
    default:'https://tse4.mm.bing.net/th?id=OIP.7HUETz0J6eRt_7psW3_TFAHaHa&pid=Api&P=0&h=220'
  }
})

module.exports=mongoose.model('user',userSchema);