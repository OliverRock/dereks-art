const express = require('express')

const router = express.Router();


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