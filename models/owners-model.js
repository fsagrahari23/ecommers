const mongoose=require('mongoose');

const OwnerSchema=mongoose.Schema({
      
    fullname: {
      type: String,
      minlength: 3,
      trim: true
    },
    email: String,
    password: String,
    product:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products'
      
    }],
    users:[{
       
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    
    }],
    picture: String,
    gstno: String,
  })
  
  module.exports=mongoose.model('owner',OwnerSchema);



