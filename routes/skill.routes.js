const express = require('express');
const Skill = require('../models/Skill.model');
const fileUploader = require('../config/cloudinary.config');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');// Import the isLoggedIn middleware to protect routes

//skill list:
router.get("/skills", (req, res, next) => {
    Skill.find()
    .populate({
      path: 'comments.user',
      model: 'User'
    })
        .then(skillsArr =>{
            const data = {
                skills: skillsArr,
                isLoggedIn: req.session.currentUser,
            };

            res.render("skills/skill-list",data);
        })
        .catch(e =>{
            console.log("error showing skills from DB", e);
            next(e);
        });
        
});


//CREATE: display form
router.get("/skills/create", isLoggedIn,(req, res, next) => {
    res.render("skills/skill-create",{isLoggedIn: req.session.currentUser});
});





// CREATE: process form
router.post("/skills", isLoggedIn, fileUploader.single('skill-image'),(req, res, next) =>{
    console.log(req.session.currentUser)
    const skillDetails = {
        title: req.body.title,
        category: req.body.category,
        photoURL: req.file.path,
        location: req.body.location,
        creator: req.session.currentUser, // Store the creator's ID
        description: req.body.description
    }

    Skill.create(skillDetails)
     .then(skillFromDB => {
        res.redirect("/skills");
     })
     .catch(e => {
        console.log("error creating new skill", e);
        next(e);
     });
});





//READ: Skill details
router.get("/skills/:skillId", (req, res, next) => {

    const { skillId } = req.params;

    Skill.findById(skillId)
        .then(skillDetails => {
            res.render("skills/skill-details", skillDetails);
        })
        .catch(e => {
            console.log("error getting skill details from DB", e);
            next(e);
        });
});



//UPDATE: display form
router.get('/skills/:skillId/edit', isLoggedIn, (req, res, next) => {
    const { skillId } = req.params;
  
    Skill.findById(skillId)
      .then(skillToEdit => {
        if (String(skillToEdit.creator) != String(req.session.currentUser._id)) {
          // If the user is not the creator, do not allow editing
          return res.status(401).send('Unauthorized: Only the creator can edit this skill.');
        }
  
        // If the user is the creator, display the edit form
        res.render('skills/skill-edit.hbs', { skill: skillToEdit });
      })
      .catch(error => next(error));
  });
  


//UPDATE: process form
router.post('/skills/:skillId/edit', isLoggedIn, (req, res, next) => {
    const { skillId } = req.params;
    const { title, category, photoURL, location, description } = req.body;
  
    Skill.findById(skillId)
      .then(skillToUpdate => {
        if (String(skillToUpdate.creator) != String(req.session.currentUser._id)) {
          // If the user is not the creator, do not allow updating
          return res.status(401).send('Unauthorized: Only the creator can update this skill.');
        } 
  
        // If the user is the creator, proceed with the update
        Skill.findByIdAndUpdate(skillId, { title, category, photoURL, location, description }, { new: true })
          .then(updatedSkill => {
            res.redirect(`/skills/${updatedSkill.id}`); //redirect to skill details page
          })
          .catch(error => next(error));
      })
      .catch(error => next(error));
  });
  
  
  
  
  //DELETE
router.post('/skills/:skillId/delete', isLoggedIn, (req, res, next) => {
    const { skillId } = req.params;
  
    Skill.findById(skillId)
      .then(skill => {
        console.log('Skill: ' + skill)
        console.log(req.session)
        if (String(skill.creator) != String(req.session.currentUser._id)) {
          // If the user is not the creator, do not allow deletion
          return res.status(401).send('Unauthorized: Only the creator can delete this skill.');
        } else{
            // If the user is the creator, proceed with the deletion
            skill.deleteOne()
              .then(() => res.redirect('/skills',))
              .catch(error => next(error));
        }

      })
      .catch(error => next(error));
});

// Add a comment:
router.post('/skills/:skillId/comment', (req, res, next) => {
  const { skillId } = req.params;
  const { text } = req.body;
  const user = req.session.currentUser;

  if (!user) {
    // Redirect user to login page if not logged in
    res.redirect("/auth/signup");
    return;
  }


  const newComment = {
    user:user._id,
    text,
  };

  Skill.findByIdAndUpdate(skillId, { $push: { comments: newComment } }, { new: true })
    .then((updatedSkill) => {
      res.redirect(`/skills`);
    })
    .catch((error) => next(error));
});

// Add a like:
router.post('/skills/:skillId/like', (req, res, next) => {
  const { skillId } = req.params;
  const user = req.session.currentUser; // 

  if (!user) {
    // Redirect user to login page if not logged in
    res.redirect("/auth/signup");
    return;
  }

  console.log(user)
 
  Skill.findByIdAndUpdate(skillId, { $addToSet: { likes: user._id} }, { new: true })
    .then((updatedSkill) => {
      res.redirect(`/skills`);
    })
    .catch((error) => next(error));
});


  
  module.exports = router;