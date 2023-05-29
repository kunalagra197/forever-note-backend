const express=require('express')
const router=express.Router();
const Notes=require('../models/Notes');
const fetchuser=require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
// Route-1:Get all the notes using :GET"/api/notes/getuser".Login required
router.get('/fetchallnotes',fetchuser,async(req,res)=>{
    try{
    const notes=await Notes.find({user:req.user.id});
    res.json(notes)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
      }

})

// Route 2:Add a new note using:POST "api/notes/addnote",Login required
router.post('/addnote',fetchuser,[body('title','Enter a valid title').isLength({min:3}),
body('description','Description must be atleast 5 characters').isLength({min:5})],async(req,res)=>{

    try{
    const errors = validationResult(req);

    // Check for bad request
    if (!errors.isEmpty()) 
    {
      return res.status(400).json({ errors: errors.array() });
    }
    const {title,description,tag}=req.body;
    const note=new Notes({
        title,description,tag,user:req.user.id
    })
    const savedNote=await note.save();
    res.json(savedNote)
}
catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }

})

// Route 3:Update a existing note using:PUT "api/notes/updatenote/:id",Login required
router.put('/updatenote/:id',fetchuser,async(req,res)=>{
  // fetchuser check whether a user is login or not .It is a middleware 
  try{
  const {title,description,tag}=req.body;
  const newNote={};
  // create a newnote object
  if(title){newNote.title=title};
  if(description){newNote.description=description}
  if(tag){newNote.tag=tag}
  let note=await Notes.findById(req.params.id);
  // checking whether a note by of given id exist or not
  if(!note){
   return  res.status(404).send("Not Found");
  }
  if(note.user.toString()!==req.user.id){
    return res.status(401).send("Not Allowed")
  }
  // Checking whether the author of the note is making a update or someother user is trying to make a change in author note 
  note =await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
  res.json({note});
}
catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server error");
}
})

// Route 4:Delete a existing note using:DELETE "api/notes/updatenote/:id",Login required
router.delete('/deletenote/:id',fetchuser,async(req,res)=>{
  // fetchuser check whether a user is login or not .It is a middleware 
  // checking whether a note by of given id exist or not
  try{
  let note=await Notes.findById(req.params.id);
  if(!note){
   return  res.status(404).send("Not Found");
  }
  // check whether the owner of the note is deleting the note or not
  if(note.user.toString()!==req.user.id){
    return res.status(401).send("Not Allowed")
  }
  
  note =await Notes.findByIdAndDelete(req.params.id)
  res.json({"Success":"Note has been deleted"});
}
catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server error");
}

})
module.exports=router