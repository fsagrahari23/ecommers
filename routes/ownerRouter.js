const express=require('express');
const router=express.Router();
const ownerModel=require('../models/owners-model')
const userModel=require('../models/userModel')
const bcrypt=require("bcrypt");
const {generateToken}=require("../utils/generate");
const isOwnerLogged = require('../middlewares/isOwner')


router.get("/",(req,res)=>{
  res.render('owner-register');
})
router.get("/log",(req,res)=>{
  res.render('owner-login');
})
if(process.env.NODE_ENV === "development"){
router.post("/create",async (req,res)=>{
const owner=await ownerModel.find()
if(owner.length>0){
  return res.send("You dont have permission")
}
    try{
      let {fullname,email,password}=req.body;
      bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async(err,hash)=>{
         if(err) return res.send(err.message);
         
         let createdowner= await ownerModel.create({
          fullname,
          email,
          password:hash,
            })
        
       
       
        res.redirect("/owner/log")
       
      
    })
      
      })
     
      }
      catch(err){
        res.send(err.message);
      }
    // res.status(201).send("owner created")
  //  ) createdowner.save();
  //   res.redirect('/admin'
  })
  
}
router.post('/login',async(req,res)=>{
const {email,password}=req.body;
 const owner= await ownerModel.findOne({email})
 if(!owner){
  return res.send("Invalid email or password")
  }
  if(owner){
    bcrypt.compare(password,owner.password,(err,result)=>{
      if(result){
        let token = generateToken(owner)
        res.cookie("token",token);
        req.session.owner=owner;
         res.redirect('/owner/admin')
        }
      }
      )
    
    }
    else{
      res.redirect('/owner/log');
    }


})
router.get("/logout",(req,res)=>{
  res.cookie("token","");
  res.redirect("/owner/log")
})
router.get("/users",isOwnerLogged,async (req,res)=>{
  try{
  const owner= await ownerModel.findOne({email:req.owner.email}).populate('users');
  res.render("usersList",{owner});
  }catch(err){
    res.send(err.message);
  }
  })
  router.get('/user/:id',async (req,res)=>{
    try{
    const user = await userModel.findById(req.params.id)
    res.render('UsePro',{user})
    }catch(err){
      res.send(err);
    }
  })


  router.get("/products",isOwnerLogged,async (req,res)=>{
    const Owner=await ownerModel.findOne({email:req.owner.email}).populate('product')

    res.render("Products",{Owner})
  })
router.get("/admin",isOwnerLogged,(req,res)=>{
 let success= req.flash("success");
  res.render("createproducts",{success});
})






module.exports = router;
