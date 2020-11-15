const 	express = require("express"),
	  	app 	= express(),
	  	bodyParser = require('body-parser'),
	  	mongoose = require('mongoose'),
	  	path 	= require('path'),
	  	multer  = require('multer'),
	  	crypto 	= require('crypto'),
	  	Painting = require('./models/painting'),
		seedDB 	= require('./seeds'),
	  	User = require('./models/user'),
	  	passport = require('passport'),
		LocalStrategy = require('passport-local'),
		passportLocalMongoose = require('passport-local-mongoose');


// Clean and setup database
seedDB();
mongoose.connect("mongodb://localhost:27017/dereks_site", {useNewUrlParser: true, useUnifiedTopology: true})


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');



// =============
// MULTER ======
// =============

// Set  up multer to read and save files uploads on the site
var storage = multer.diskStorage({
  destination: 'public/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})

var upload = multer({ storage: storage })
//Set path so that  website can  access public folder where pics are stores
app.use(express.static('public'));



// =============
// PASSPORT ====
// =============

app.use(require("express-session")({
	secret: "This is a secret and must be kept secret",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})


// =============
// ROUTES ======
// =============



// Home page
app.get("/", function(req, res){
	console.log("user connected")
	res.render("landing");
	console.error("A user connected")

})


app.get("/todo", function(req, res){
	res.send("I still need to build this.")
})


// View all catagories
app.get("/catagories", function(req, res){
	console.log(req.user)
	Painting.find({}, 'themes image',function(err, allThemes){
		if(err){
			console.log(err);
		} else {
			console.log(allThemes)			
			res.render("catagories", {dates: getAllDates(), themes: getUniqueThemes(allThemes)});
		}
	})
	
})


// Get a catagory of painting
app.get("/catagory/:type/:catagory", function(req, res){
	
	Painting.find({"themes":req.params.catagory}, function(err, paintings){
		if(err){
			console.log(err);
		} else {
		res.render("collection", {title: req.params.catagory, paintings: paintings});
		}
	})

})




// Add a new painting - form
app.get("/painting/new", function(req, res){
	res.render("new");
});


// Upload a new painting
app.post('/painting/new', upload.single('avatar'), function (req, res, next) {
  console.log(req.file)// is the `avatar` file
  console.log(req.body)// will hold the text fields, if there were any
	
	var newPainting = {
		title: req.body.title,
		date: req.body.date,
		themes: makeCatagoryList(req.body.catagory),
		description: req.body.description,
		image: req.file.filename
	}
	
	Painting.create(newPainting, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect("/catagories");
		}
	})	
})


// Show one painting
app.get("/painting/:id", function(req, res){
	Painting.findById(req.params.id, function(err, paint){
		if(err){
			console.log(err)
		} else {
			res.render("painting", {painting: paint});
		}
	})
});


// Edit an existing painting
app.get("/painting/edit/:id", function(req, res){
	Painting.findById(req.params.id, function(err, paint){
		if(err){
			console.log(err)
		} else {
			res.render("edit", {painting: paint});
		}
	})
});


app.post("/painting/edit/:id", function(req, res, next){
	var newPainting = {
		title: req.body.title,
		date: req.body.date,
		themes: makeCatagoryList(req.body.catagory),
		description: req.body.description
	}
	Painting.updateOne({"_id": mongoose.Types.ObjectId(req.params.id) }, {$set: newPainting}, function(err, updatedPaint){
		if(err){
			console.log(err)
		}
		res.redirect("/painting/" + req.params.id);
	})
})


//====================


function findPaintingById(id){
	for(i=0; i<paintings.length ; i ++){
		if(paintings[i].id == id){
			return paintings[i];
		}
	}
	return null
}

function getAllThemes(){
	var themes = []
	for(i=0; i<paintings.length ; i ++){
		paintings[i].themes.forEach(t => {
			if(themes.indexOf(t) < 0){
				themes.push(t)
			}
			
		})
	}
	return themes
}

function getUniqueThemes(allThemes){
	results = [];
	uniqueThemes = [];
	allThemes.forEach(function(entry){
		entry.themes.forEach(function(theme){
			if (uniqueThemes.indexOf(theme) < 0) {
				results.push({theme: theme, image: entry.image});
				uniqueThemes.push(theme);
				}
		})
	})
	
	console.log(results)
	return results;

}

function getAllDates(){
	return ["1979s", "1980s", "1990s", "2000s"]
}

function makeCatagoryList(str){
	var lst = str.split(',');
	for(i=0 ; i < lst.length ; i++){
		lst[i] = lst[i].trim();
	}
	return lst;
}

function getPaintsByCat(catagory){
	var results = []
	paintings.forEach(paint => {
		paint.themes.forEach(t => {
			if(t == catagory){
				results.push(paint)
			}
		})
		
	})
	return results
}

function getId(){
	return paintings.length + 1
}

	

// =============
// AUTH ========
// =============

app.get('/register', function(req, res){
	res.render('register');
})

app.post("/register", function(req, res){
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err)
			return res.render('register')
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("catagories")
		})
	})
})


//login routes
app.get('/login', function(req, res){
	res.render('login')
})

app.post('/login', passport.authenticate("local",{
	successRedirect: "/catagories",
	failureRedirect: '/login'
	} ),function(req, res){	
})


// Logout
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/')
})


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login')
}


// Run server
app.listen(3000, function(){
	console.log("Server is running!!")
});