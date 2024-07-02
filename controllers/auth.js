

const userModel = require('../models/userModel');
const ownerModel = require('../models/owners-model');
const key=require('../config/key');
const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");
const {generateToken}=require("../utils/generate");


module.exports.registerUser=async (req,res)=>{

  try{
  let {email,fullname,password}=req.body;
  let user=await userModel.findOne({email:email});
  if(user){
   return res.status(401).send("email address already in use, please use another email");
  }
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt,async(err,hash)=>{
     if(err) return res.send(err.message);
     
    let user = (await userModel.create({email,password:hash,fullname}));
    //add user id to owner model
    let owner= await ownerModel.findOne({_id:'667dacd456a16bd65158f987'}).populate('users');
    owner.users.push(user._id);

    owner.save();
    res.redirect('/')
    


    
    
  
})
  
  })
 
  }
  catch(err){
    res.send(err.message);
  }
  
 }
 module.exports.loginUser= async (req,res)=>{
  let {email,password}=req.body;
  let user = await userModel.findOne({email:email});
  if(!user){
    return res.send("Email or password is incorrect")
  }
  bcrypt.compare(password,user.password,(err,result)=>{
     if(result){
    let token = generateToken(user)
    res.cookie("token",token);
    res.redirect("/shop");
      
     }
     else{
      res.redirect('/err-page')
     }
  })
 }

 module.exports.logout = async(req,res)=>{
  try{
  res.cookie("token","");
  res.redirect("/");
  }catch(err){
    res.redirect('/err-page')
  }
 }