// set up ======================================================================
var express        = require('express');
var app            = express(); 								// create our app w/ express
var port           = process.env.PORT || 80; 				// set the port
var models         = require('./models');

var morgan         = require('morgan'); 		// log requests to the console (express4)
var bodyParser     = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// authentication ==============================================================
var passport       = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var JwtStrategy    = require('passport-jwt').Strategy;
var ExtractJwt     = require('passport-jwt').ExtractJwt;

// configuration ===============================================================

app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
//app.use(morgan('dev')); 										// log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); 									// parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

//authentication configuration =================================================
var User = models.User;

passport.use(new GoogleStrategy({
	clientID: "CLIENTID",
	clientSecret: "CLIENTSECRET",
	callbackURL: "http://localhost:" + port + "/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
	User
	.findOrCreate({where: {google_id: profile.id}, defaults: {name: profile.displayName}})
	.spread(function(user, created) {
		cb(null, user)
	})
}));

var myQueryExtractor = function(req) {
	var url = require('url');
	return req.get('X-Auth-Token');
	//return url.parse(req.url, true).query['jsonwebtoken'];
};
passport.use(new JwtStrategy({
	secretOrKey: 'vitorsecret',
	jwtFromRequest: myQueryExtractor
},
function(jwt_payload, done) {
	User.
	findOne({id: jwt_payload.id}).then(
		function(user) {
			if (user) {
				done(null, user);
			} else {
				done(null, false);
			}
		},
		function(err) {
			if (err) {
				return done(err, false);
			}
		}
		)
}
));

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
models.sequelize.sync().then(function () {
	app.listen(port);
	console.log("Behold the power of the todo app on port " + port);
});
