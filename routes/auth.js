const express=require('express')
const router=express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const JWT_SECRET='KunalAgrawal'
const fetchuser=require('../middleware/fetchuser');
// route-1 validation and create a user
router.post('/createuser',[ 
    body('name').isLength({min:3}),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })],async(req,res)=>{
    const errors = validationResult(req);
      let success=false;
    // Check for bad request
    if (!errors.isEmpty()) 
    {
      
      return res.status(400).json({ success,errors: errors.array() });
    }
  
    try{
      // to find the existence of already registered user
    let user=await User.findOne({email:req.body.email});
    if(user){
      return res.status(400).json({success,error:"Sorry a user with this email already exist"})
    }
    // to create hash passwords using salting

    const salt=await bcrypt.genSalt(10); //return a promise and promise need to be resolved first
    const secPass=await bcrypt.hash(req.body.password,salt);

    // create a new user
    user=await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })
    const data={
      user:{
        id:user.id
      }
    }
    success=true;
    const jwtData=jwt.sign(data,JWT_SECRET);
    console.log(jwtData)
    res.json({success,jwtData});
  }
  catch(error)
  {
    console.error(error.message);
    res.status(500).send("Some Error message");
  }
})

//  route-2 login 
router.post('/login',[ 
  body('email','Enter the valid email').isEmail(),
  body('password','Password cannot be blank').exists()],async(req,res)=>{
  const errors = validationResult(req);
  let success=false;
  if (!errors.isEmpty()) 
  {

    return res.status(400).json({success,errors: errors.array() });
  }
  // requesting email and password from body
  const {email,password}=req.body
  try {
    let user = await User.findOne({email});
    // check whether the email of such user exist or not
    if(!user){
      return res.status(400).json({success,error:'Wrong Credentials'});
    }
    // check whether the password is correct or not
    const passwordcompare=await bcrypt.compare(password,user.password);
    if(!passwordcompare)
    {
  
      return res.status(400).json({success,error:'Wrong Credentials'});
    }
    const data={
      user:{
        id:user.id
      }
    }
    success=true;
    const authtoken=jwt.sign(data,JWT_SECRET);
    res.json({success,authtoken})
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
}
)

//Route-3  Get user details
router.post('/getuser',fetchuser,async(req,res)=>{
  try {
    userid=req.user.id
    console.log(userid)
    const user=await User.findById(userid).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
})

module.exports=router