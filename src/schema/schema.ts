import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const user = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});


const content = new Schema({
    title: {type : String},
    content: { type: String },
    contentType : {enum : ['image' , 'audio' , 'video' , 'text' , 'link']},
    tags : {type : ObjectId , ref:"Tag"},
    userId : {type : ObjectId , ref:"User"}
});


const tag = new Schema({
    title:String
})


const sharing_link = new Schema({
    hash : String,
    userId : {type : ObjectId , ref:'User'}
})

const UserModel = mongoose.model("User" , user)
const ContentModel = mongoose.model("Content" , content)
const TagModel = mongoose.model("Tag" , tag)
const LinkModel = mongoose.model("Link" , sharing_link)

export {UserModel , ContentModel , TagModel , LinkModel}