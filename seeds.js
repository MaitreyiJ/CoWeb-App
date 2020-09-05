const mongoose=require("mongoose");

const connect=mongoose.connect("mongodb://localhost/connectDB");
const connectBlogs=mongoose.connect("mongodb://localhost/blogDB");
var data=[
	{name:"Peter",
   image:"https://picsum.photos/id/1012/400/400",
   userID:"Peter",
   hospitalLocation:"Hillsborough: BayCare Urgent Care",
   state:"florida"
   
  }
]
function seedDB(){
	  var Contact=require("./models/contacts");
     var Blogs=require("./models/posts");
	 Contact.remove({},function(err){
	if(err)
		{console.log(err);}
	else{console.log("removed Contacts");}
	});
	Blogs.remove({},function(err){
	if(err)
		{console.log(err);}
	else{console.log("removed Blogs");}
	});
	
	// // data.forEach(function(seed){
	// // 	Contact.create(seed, function (err,contact){
	// //   if(err){
	// // 	  console.log(err);
	// //   }else{
	// // 	  console.log("NEWLY CREATED CONTACT!");
	// // 	  console.log(contact);
	// // // Blogs.create(
	// // // {
	// // //  postTo:"Linda Johnson",postBody:"Hi Linda! How are you doing today? This photo was taken on my visit to Smoky Mountains National Park.",postImage:"https://picsum.photos/id/1015/200/200",postTitle:"Smoky Mountains National Park Visit"
	// // // }, function (err,blogs){
	// // // if(err){
	// // // console.log(err);
	// // // }else{
		  
	// // // contact.posts.push(blogs);
	// // // contact.save();
		  
	// // // console.log("NEWLY CREATED BLOG!");
	// // // console.log(contact);
	// // // }
	  
	  
	  
	// // // });

	// //   }
	  
	  
	  
	// });

	// })
	
	
	
	
}

module.exports=seedDB;
