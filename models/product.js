const { type } = require('express/lib/response');
const mongoose=require('mongoose');


const productSchema= mongoose.Schema({
  image: Buffer,
  name: String,
  price: Number,
  
  discount:{
    type: Number,
    default: 0
  },
  bgcolor : String,
  panelcolor : String,
  textcolor : String,
  comments:[{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
   comment:String,
   date:{
    type: Date,
    default: Date.now()
   }
  }],
  description:String,
  category:String,
  rating:[{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', 
    },
    rate:{
      type:Number
    }
  }],
  totalRating:{
    type:Number
  }
})

module.exports=mongoose.model('products',productSchema);