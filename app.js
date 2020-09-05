var express=require('express');
var app=express();
const axios=require('axios');
var bodyParser = require('body-parser');
var methodOverride=require('method-override');
const mongoose=require("mongoose");
var expressSanitizer=require("express-sanitizer");
var seedDB=require("./seeds");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var flash=require("connect-flash");
// seedDB();//Temporarily switched off 
//The contacts data base
var Contact=require("./models/contacts");

//The blogs data base
var Blogs=require("./models/posts");

//The users of this app
var User=require("./models/users");

//Refactoring Routes 
var blogsRoutes=require("./routes/blogs");
var contactsRoutes=require("./routes/contacts");

//Connecting our users (logged in/registered) with their blog posts


app.use(function(req,res,next){
	if(req.user)
	{res.locals.currentUser=req.user.username;
	next();
	}else{
		res.locals.currentUser=req.user;
	next();
	}
});












// app.use(function(req,res,next){
// 	if(req.user)
// 	{res.locals.currentUser=req.user.username;
// 	next();
// 	}
// });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(flash());
//ADDING AUTH
//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"Once again Rusty wins the cutest dog",
	resave:false,
	saveUnitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



















//Landing page 
app.get("/",function(req,res){
	//functionality to find the user and 
	//display all his posts 
	// 
	if(req.user)//this implies logged in 
		{	res.render("landing.ejs",{currentUser:req.user.username,message:"Logged in !"});

			
		}else{
				res.render("landing.ejs",{currentUser:req.user,message:"Not Logged in!"});

		}
});

//App development - Web vs Covid 
//Major components-
//1.API for testing locations
//2.Databases for connecting patients in same hospital / survivors
//3.Chat Rooms for common interest.
//4.How are you feeling today section ...
//5.Mental wellness suggestions for Covid-19 patients.
//Connect it to our list of web pages 
app.get("/search",function(req,res){
	res.render("search.ejs");
});


app.get("/testingLocations",function(req,res){
// Make a request for a user with a given state name
var stateName=req.query.state;
var query="https://covid-19-testing.github.io/locations/" +stateName +"/complete.json";	
	
axios.get(query)
  .then(function (response) {
    // handle success
	
	var data=response['data'];
	res.render("testingloc.ejs",{data:data});
	
    
 })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
});



//AUTH ROUTES
app.get("/register",function(req,res){
	req.flash("error","Please Login first");
	res.render("register.ejs",{message:"Register!"});
});

//SIGN  IN UPDATE
app.post("/register",function(req,res){
	var newUser=new User({username:req.body.username,location:req.body.location});
	User.register(newUser,req.body.password,function(err){
		if(err)
			{console.log(err);
			req.flash("error","Please Login first");

			return res.render("register.ejs",{message:String(err)});
			}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/");
		});
	});
});

//LOGIN ROUTES
app.get("/login",function(req,res){
	res.render("login.ejs",{message:"You need to login first!"});
});








app.post("/login",passport.authenticate("local",
										{ successRedirect:"/KeepCalm&Connect",
										 failureRedirect:"/login"
										}),function(req,res){
	//use middleware
});
//function to check if user is logged in or not 
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please Login first");
	res.redirect("/login");
}
//LOGOUT ROUTE 
app.get("/logout",function(req,res){
	req.logout();
	req.flash("error","Please Login first");

	res.redirect("/");

	
});
//Route to display all nearby"located users" very important 
app.get("/Nearme",isLoggedIn,function(req,res){
	User.find({location:req.user.location},function(err,nearbyUsers){
		if(err)
			{
				console.log(err);
			}
		else{
			console.log(nearbyUsers);
			res.render("nearby.ejs",{usersFound:nearbyUsers,currentUser:req.user.username});
		}
		
	});
	
	
	
});



app.use(blogsRoutes);
app.use(contactsRoutes);

app.listen(3000,function(){
	console.log("Server listening on port 3000");
});


