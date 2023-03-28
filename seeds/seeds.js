const mongoose = require('mongoose');
const Skill = require('../models/Skill.model');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skill-swap';


const skills = [
    {
        title: "Teaching German",
        category:"Communication",
       photoURL: "https://res.cloudinary.com/dv9yubte7/image/upload/v1679947029/german-language.jpg",
       location: "Berlin"
    },
    {
        title: "Yoga Class",
        category:"Lifestyle",
       photoURL: "https://res.cloudinary.com/dv9yubte7/image/upload/v1679947029/yoga.jpg",
       location: "Utrecht"
    },
    {
        title: "Painting",
        category:"Creative",
       photoURL: "https://res.cloudinary.com/dv9yubte7/image/upload/v1679947029/painting.jpg",
       location: "London"
    },
    {
        title: "Cooking ",
        category:"Lifestyle",
       photoURL: "https://res.cloudinary.com/dv9yubte7/image/upload/v1679946672/cld-sample-4.jpg",
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

