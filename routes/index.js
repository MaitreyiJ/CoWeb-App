var express=require("express");
var router=express.Router();//AUTH ROUTES
var User=require("../models/users");
var bodyParser = require('body-parser');
var methodOverride=require('method-override');
var passport=require("passport");

const mongoose=require("mongoose");
var expressSanitizer=require("express-sanitizer");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");

router.use(require("express-session")({
	secret:"Once again Rusty wins the cutest dog",
	resave:false,
	saveUnitialized:false
}));

router.use(passport.initialize());
router.use(passport.session());
router.use(bodyParser.json());
router.use(express.static("public"));
router.use(methodOverride("_method"));
router.use(expressSanitizer());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


router.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});







router.get("/register",function(req,res){
	res.render("register.ejs");
});

//SIGN  IN UPDATE
router.post("/register",function(req,res){
	var newUser=new User({username:req.body.username,location:req.body.location});
	User.register(newUser,req.body.password,function(err){
		if(err)
			{console.log(err);
			return res.render("register.ejs");
			}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/");
		});
	});
});

//LOGIN ROUTES
router.get("/login",function(req,res){
	res.render("login.ejs");
});

router.post("/login",passport.authenticate("local",
										{ successRedirect:"/KeepCalm&Connect",failureRedirect:"/login"
										}),function(req,res){
	//use middleware
console.log(err);

	
});
//function to check if user is logged in or not 
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}






//LOGOUT ROUTE 
router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
	
});
module.exports=router;



