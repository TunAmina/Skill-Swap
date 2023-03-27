const { Schema, model } = require("mongoose");

const skillSchema = new Schema ({
    title: String,
    category : {
        type: String,
       enum: ["Creative", "Technical", "Communication", "Lifestyle", "Professional"]
    },
    photoURL: String,
    location : String,
})

const Skill = model("Skill", skillSchema);

module.exports = Skill;
