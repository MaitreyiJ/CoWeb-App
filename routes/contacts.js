var express=require("express");
var router=express.Router();
var Contact=require("../models/contacts");
var Blogs=require("../models/posts");
var bodyParser = require('body-parser');
var methodOverride=require('method-override');
var expressSanitizer=require("express-sanitizer");
var flash=require("connect-flash");

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




router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());
router.use(express.static("public"));
router.use(methodOverride("_method"));
router.use(expressSanitizer());
router.get("/KeepCalm&Connect",isLoggedIn,function(req,res){
	
//get from database all Contacts that you added!!!!!only 
Contact.find({"author.username":req.user.username},function(err,allContacts){
	if(err){
		console.log(err);
	}else{
		
		console.log(allContacts);
	
			res.render("Connect.ejs", {userData:allContacts});

		}
	
	});
});

router.post("/KeepCalm&Connect",isLoggedIn,function(req,res){
	//Take data from sign up form
	//add to the array-userData
	//redirect back to contacts page 
	var name=req.body.name;
	var image=req.body.image;
	var userID=req.body.userID;
	var hospital=req.body.hospital;
	var state=req.body.state;
    var author={
		id:req.user._id,
		username:req.user.username
		
	};
	var newContact={name:name,image:image,userID:userID,hospitalLocation:hospital,state:state,author:author};
	//create a new contact and add to Data base 
	Contact.create(newContact,function (err,contact){
	  if(err){
		  console.log(err);
	  }else{
		   console.log(contact);
		 	res.redirect("/KeepCalm&Connect");

	  }
	  
	  
	  
  });





});

router.get("/KeepCalm&Connect/newConnections",isLoggedIn,function(req,res){
	res.render("newConnections.ejs");
	
});
//We only display contacts that are added by user-to post a message 
//If not addded redirect to post a message 

router.get("/KeepCalm&Connect/:id",isLoggedIn,function(req,res){
	
	Contact.findById(req.params.id).populate("posts").exec(function(err,foundContact){
		if(err)
			{
				console.log(err);
			}
		else{  console.log(foundContact);
				res.render("show.ejs",{contact:foundContact,user:req.user.username});

		}
		
	});
});

//EDIT AND UPDATE FOR CONTACTS?DO WE NEED THIS
//Not working on contacts update/edit mechanism 

//DESTROY CONTACTS

router.delete("/KeepCalm&Connect/:id",checkAuth,function(req,res){
		       Contact.findByIdAndRemove(req.params.id,function(err){
		if(err)
		{res.redirect("/KeepCalm&Connect");
		}else{//does the user added this conatact?
				res.redirect("/KeepCalm&Connect");}
					
			 });
});       
	
										 	
	
	
	


function checkAuth(req,res,next)
{   if(req.isAuthenticated)
	   {Contact.findById(req.params.id,function(err,foundContact)			{if(err)
			 {res.redirect("back");}
																			 else
			 {//did  the user added this conatact?
			  if(foundContact.author.id.equals(req.user._id))
				 {next();}
				  else
				  {   
					  res.redirect("back");}
			 }
		});
	}else{
		console.log("You need to be logged in");
		res.redirect("/login");}
	
	
}





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
