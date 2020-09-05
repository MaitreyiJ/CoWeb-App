var mongoose = require ("mongoose")
var passportLocalMongoose=require("passport-local-mongoose");
const Schema = mongoose.Schema;

var userSchema=new Schema({
	userName:String,
	password:String,
	location:String
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);