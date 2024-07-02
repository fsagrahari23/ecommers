const express=require('express');
const router=express.Router();
const bcrypt=require("bcrypt");
const {registerUser}=require("../controllers/auth");
const {loginUser}=require("../controllers/auth");
const {logout}=require("../controllers/auth");
const isLoggedIn = require('../middlewares/isLoggedIn');
const isowner = require('../middlewares/isOwner');
const userModel = require('../models/userModel');
const upload=require("../config/multer-config");





router.post('/register',registerUser)

router.post('/login',loginUser);

router.get('/logout',logout);

router.get('/',isLoggedIn,async(req,res)=>{
  try{
    const user= await userModel.findOne({email:req.user.email})
    res.render("userprofile",{user});
  }catch(err){
    console.log(err);
    res.redirect('/err-page');
  }
  
})
router.get('/edit/:id',isLoggedIn,async (req,res)=>{
  const user= await userModel.findOne({email:req.user.email})
  res.render('userEdit',{user});
})

router.post('/update-user',isLoggedIn,async (req,res)=>{
  try{
  const {fullname,email,password,address,contact}=req.body;
  const Email=req.user.email;
  let user = await userModel.findOne({email:Email})
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,async(err,hash)=>{
     if(err) return res.send(err.message);
     user.fullname=fullname
     user.email=email
     user.password=hash
     user.address=address
     user.contact.push(contact);
     await user.save();
    //add user id to owner model
    // let owner= await ownerModel.findOne({_id:'667dacd456a16bd65158f987'}).populate('users');
    
})
  
  })
   res.redirect('/users');
}
catch(err){
  console.log(err);
}
})

module.exports = router;
