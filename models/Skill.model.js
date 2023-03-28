// Add a reference to the User model
const { Schema, model } = require("mongoose");
const User = require("./User.model");

const skillSchema = new Schema ({
    title: String,
    category : {
        type: String,
        enum: ["Creative", "Technical", "Communication", "Lifestyle", "Professional"]
    },
    photoURL: String,
    location : String,
    creator: { // Add the creator field
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Skill = model("Skill", skillSchema);

module.exports = Skill;
