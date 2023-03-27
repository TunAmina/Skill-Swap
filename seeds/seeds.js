const mongoose = require('mongoose');
const Skill = require('../models/Skill.model');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skill-swap';


const skills = [
    {
        title: "Teaching German",
        category:"Communication",
       photoURL: "../public/images/german-language.jpeg",
       location: "Berlin"
    },
    {
        title: "Yoga Class",
        category:"Lifestyle",
       photoURL: "../public/images/yoga.jpeg",
       location: "Utrecht"
    },
    {
        title: "Painting",
        category:"Creative",
       photoURL: "../public/images/painting.jpeg",
       location: "London"
    },
    {
        title: "Cooking ",
        category:"Lifestyle",
       photoURL: "../public/images/cooking.jpg",
       location: "Paris"
    }
];


mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );

   //return Skill.deleteMany({}); //WARNING: this will delete all skill in your DB !!

  })
  .then( (response) => {
    console.log(response);

    return Skill.insertMany(skills);
  })
  .then(skillsFromDB => {
    console.log(`Created ${skillsFromDB.length} skills`);

    // Once created, close the DB connection
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error connecting to DB: ", err);
  });

