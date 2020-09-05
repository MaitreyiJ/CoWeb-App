var express=require("express");
var router=express.Router();
var bodyParser = require('body-parser');
var methodOverride=require('method-override');
var expressSanitizer=require("express-sanitizer");
var flash=require("connect-flash");

var Blogs=require("../models/posts");
var Contact=require("../models/contacts");
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
router.use(express.static("public"));
router.use(methodOverride("_method"));
router.use(expressSanitizer());
router.use(flash());

router.use(function(req,res,next){
	if(req.user)
	{res.locals.currentUser=req.user.username;
	next();
	}else{
		res.locals.currentUser=req.user;
	next();
	}
});
//Connecting a "post a message" app
//Index Route
//Connecting a "post a message" app
//Index Route
router.get("/blogs",isLoggedIn,function(req,res){

	Blogs.find({$or:[{postTo:req.user.username},{"author.username":req.user.username}]},function(err,allBlogs){
		if(err)
			{
				console.log(err);
			}
	    else{
			console.log("allBlogstoDisplayare");
            console.log(allBlogs);
			res.render("index.ejs",{posts:allBlogs});

		}
	});
});
//NEW ROUTE 
router.get ("/blogs/:To/new",isLoggedIn,function(req,res){
	console.log(req.body);
	res.render("newBlogs.ejs",{blog:req.body.To});
});

//CREATE ROUTE
router.post("/blogs",isLoggedIn,function(req,res){
	//Take data from sign up form
	//add to the array-userData
	//redirect back to contacts page 
	
	// req.body.blog.body=req.sanitize(req.body.blog.body);
	
	var postto=req.body.To;
	var postimage=req.body.image;
	var postbody=req.body.Body;
	var postTitle=req.body.Title;
	

	var newBlog={postTo:postto,postImage:postimage,postBody:postbody,postTitle:postTitle};
	
	
	
	
	//Update the newly created Blog ->reference it to the contact who created it and the contact to whom it was sent
	Blogs.create(newBlog,function (err,blogs){
	  if(err){
		  console.log(err);
	  }else{ 
		console.log(blogs);
		  console.log(blogs.postTo);
 

		 Contact.findOne({name:String(blogs.postTo)},function(err,contactFound){
				
				 if(err)
					 {
						 console.log(err);
					 }
				 else{
					 console.log("The contact to is ");
					 console.log(contactFound);
					 //before we push the blog post"to" whoever it is addressed to" from the contact list", We also should push it to that "Particluar: user in user data base 
					 //get the Username,id
					 
					 blogs.author.id=req.user._id;
					 blogs.author.username=req.user.username;
					 blogs.save();
					 contactFound.posts.push(blogs);
					 contactFound.save(function(err,data){
						 if(err){
							 console.log(err);
						 }else{
							 console.log(blogs);
							 console.log(data);
						 }
					 });
				 }
			 });
		 	 res.redirect("/blogs");
             
	  }
	  
    });
	
	
	
	
	
});

//SHOW ROUTE

router.get("/blogs/:id",isLoggedIn,function(req,res){
	
	Blogs.findById(req.params.id,function(err,foundBlog){
		if(err)
			{
				console.log(err);
			}
		else{
				res.render("showBlogs.ejs",{blog:foundBlog});

		}
		
	});
});

//EDIT ROUTE 
router.get("/blogs/:id/edit",isLoggedIn,function(req,res){
	Blogs.findById(req.params.id,function(err,foundBlog){
		
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			res.render("edit.ejs",{blog:foundBlog});
		}
	});
	
	
});

//UPDATE ROUTE 
router.put("/blogs/:id",isLoggedIn,function(req,res){
	//req.body.blog.body=req.sanitize(req.body.blog.body);
	var postto=req.body.To;
	var postimage=req.body.image;
	var postbody=req.body.Body;
	var postTitle=req.body.Title;
	var id=req.params.id;

	var newBlog={_id:id,postTo:postto,postTitle:postTitle,postImage:postimage,postBody:postbody};
	
	
	Blogs.findByIdAndUpdate(req.params.id, {$set:  newBlog },{ new: true} ,function(err,updatedBlog){
		if(err){
			console.log(err);
	     res.redirect("/blogs");
		}else{
			console.log(req.body.blog);
			console.log("The updated blog is ");
			console.log(updatedBlog);
			res.redirect("/blogs/"+updatedBlog._id);
		}
	});
	
});

router.delete("/blogs/:id",function(req,res){
    //delete the blog and redirect 
	Blogs.findByIdAndRemove(req.params.id,function(err){
		if(err)
			{
				res.redirect("/blogs");
			}
		else{
			res.redirect("/blogs");
		}
	});
});














//function to check if user is logged in or not 
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	console.log("Displaying error message ");
	req.flash("error","Please Login first");
	console.log("error");
	res.redirect("/login");
}
module.exports=router;











