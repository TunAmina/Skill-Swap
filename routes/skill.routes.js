const express = require('express');
const Skill = require('../models/Skill.model');


const router = express.Router();

//skill list:
router.get("/skills", (req, res, next) => {
    Skill.find()
        .then(skillsArr =>{
            const data = {
                skills: skillsArr
            };

            res.render("skills/skill-list", data);
        })
        .catch(e =>{
            console.log("error showing skills from DB", e);
            next(e);
        });
});


//CREATE: display form
router.get("/skills/create", (req, res, next) => {
    res.render("skills/skill-create");
});


//CREATE: process form
router.post("/skills", (req, res, next) =>{

    const skillDetails = {
        title: req.body.title,
        category: req.body.category.type,
        photoURL: req.body.photoURL,
        location: req.body.location
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
router.get('skills/:skillId/edit', (req, res, next) =>{
    const { skillId } = req.params;

    skill.findById(skillId)
     .then(skillToEdit => {
        res.rednder('skills/skill-edit.hbs', { skill: skillToEdit });
     })
     .catch(error => next(error));
});



//UPDATE: process form
router.post('/skills/:skillId/edit', (req, res, next) => {
    const { skillId } = req.params;
    const { title, category, photoURL, location} = req.body;
  
    skill.findByIdAndUpdate(skillId, { title, category, photoURL, location }, { new: true })
      .then(updatedSkill => {
        res.redirect(`/skills/${updatedSkill.id}`); //redirect to book details page
      })
      .catch(error => next(error));
  });
  
  
  
  //DELETE
  router.post('/skills/:skillId/delete', (req, res, next) => {
    const { skillId } = req.params;
  
    skill.findByIdAndDelete(skillId)
      .then(() => res.redirect('/skills'))
      .catch(error => next(error));
  });
  
  
  
  module.exports = router;