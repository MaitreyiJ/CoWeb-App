const mongoose=require("mongoose");

const Schema = mongoose.Schema;

//Schema set up 
var blogsSchema=new Schema({
	postTo:String,
	postTitle:String,
	postImage:String,
	postBody:String,
	postCreated:{type:Date,default:Date.now},
	//Author of this post-From where it came 
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	}
	
});

module.exports=mongoose.model("Blogs",blogsSchema);