const express=require('express');
const router=express.Router();
const isLoggedin=require("../middlewares/isLoggedIn")
const upload=require("../config/multer-config");
const productModel=require("../models/product");
const userModel=require("../models/userModel");
const ownerModel=require("../models/owners-model");

router.post("/create",isLoggedin,upload.single("image"),async(req,res)=>{
 try{const  {
  image,
  name,
  price,
  discount,
  bgcolor,
  panelcolor,
  textcolor,
  description}=req.body;
  let product = await productModel.create({
    image:req.file.buffer,
    name,
    price,
    discount,
    bgcolor,
    panelcolor,
    textcolor,
    description
  }) 
  let owner= await ownerModel.findOne({_id:'667dacd456a16bd65158f987'}).populate('product');
    owner.product.push(product._id);
    owner.save();
  req.flash("success","Product created successfull");
   res.redirect('/owner/admin');
}
  catch(err){
     res.send(err.message);
  }

})

router.get("/:id",isLoggedin,async (req,res)=>{
  try{
  const user = await userModel.findOne({email:req.user.email});
  let owner= await ownerModel.findOne({_id:'667dacd456a16bd65158f987'})
  .populate('users')
  
  const product= await productModel.findById(req.params.id).populate('comments.userId','rating.userId');
  var sum=0;
  product.rating.forEach(e=>{
    sum+=e.rate;
  })
  
  res.render("productView",{product:product,user,sum,owner})
  } catch(err){
    console.log(err.message);
  }
})
router.post('/:id/comment',isLoggedin, async (req, res)=>{
  try {
  const user = await userModel.findOne({email:req.user.email});
  const { comment ,date } = req.body;

  
    const product = await productModel.findById(req.params.id).populate('comments');
    product.comments.push({ userId:user._id , comment ,date });
    await product.save();
    res.redirect(`/products/${req.params.id}`);
  } catch (err) {
    res.status(500).redirect('/products');

  }
});

router.post('/:id/rate', isLoggedin,async (req, res) => {
  try {
  const user = await userModel.findOne({email:req.user.email});
  const { rating } = req.body;
  
    const product = await productModel.findById(req.params.id).populate('rating');
    var e=0;
    
    const userRating = product.rating.find(r => r.userId.toString() === (user._id).toString());
    
    
    product.rating.push({rate:Number(rating),userId:user._id});
    user.ratedProducts.push({productId: product._id, rating});
    await product.save();
    
    await user.save();
    
    res.redirect(`/products/${req.params.id}`);

  } catch (err) {
    
    res.redirect('/shop');
  }
});
// router.post("/")
module.exports = router
