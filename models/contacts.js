const mongoose=require("mongoose");

const Schema = mongoose.Schema;

var contactSchema=new Schema({
	name:String,
	image:String,
	userID:String,
	hospitalLocation:String,
	state:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	},
	//data association by referencing 
	posts:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Blogs"
	}]
	
});

module.exports=mongoose.model("Contact",contactSchema);