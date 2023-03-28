// Add a reference to the User model
const { Schema, model } = require("mongoose");
const User = require("./User.model");



const commentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, 
            ref: 'User' },
    text: String,
  });



const skillSchema = new Schema ({
    title: String,
    category : {
        type: String,
        enum: ["Creative", "Technical", "Communication", "Lifestyle", "Professional"]
    },
    photoURL: String,
    location : String,
    description: String,
    creator: { // Add the creator field
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [commentSchema],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});



const Skill = model("Skill", skillSchema);

module.exports = Skill;
