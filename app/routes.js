var models = require('../models');
var Todo = models.Todo;
var User = models.User;

var passport = require('passport');

module.exports = function(app) {


	function handleError(err, req, res, next) {
		var output = {
			error: {
				name: err.name,
				message: err.message,
				text: err.toString()
			}
		};
		var statusCode = err.status || 500;
		res.status(statusCode).json(output);
	}

	// api ---------------------------------------------------------------------
	// get all todos
	app.get('/api/todos', passport.authenticate('jwt', { session: false, failWithError: true }), function(req, res) {
		//get and return all the todos
		User.findAll({
			where: {
				id: req.user.dataValues.id
			},
			include: [models.Todo]
		}).then(function(todos) {
			res.json(todos);
		})
	}, handleError
	);

	// create todo and send back all todos after creation
	app.post('/api/todos', passport.authenticate('jwt', { session: false, failWithError: true }), function(req, res) {
		Todo.create({
			text: req.body.text,
			done: false,
			UserId: req.user.dataValues.id
		}).then(function(todo) {
			//get and return all the todos
			User.findAll({
				where: {
					id: req.user.dataValues.id
				},
				include: [models.Todo]
			}).then(function(todos) {
				res.json(todos);
			})
		})
	}, handleError
	);

	// delete a todo (req.params.todo_id)
	app.delete('/api/todos/:todo_id', passport.authenticate('jwt', { session: false, failWithError: true }), function(req, res) {
		Todo.destroy({
			where: {
				id: req.params.todo_id
			}
		}).then(function() {
			//get and return all the todos
			User.findAll({
				where: {
					id: req.user.dataValues.id
				},
				include: [models.Todo]
			}).then(function(todos) {
				res.json(todos);
			})
		})
	}, handleError
	);

	//authentication -----------------------------------------------------------
	app.get('/auth/google',
		passport.authenticate('google', { session: false, scope: ['profile'] })
		);

	app.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: "/login" }), function(req, res) {
		var jwt = require('jsonwebtoken');
		var token = jwt.sign({ id: req.user.dataValues.id}, 'vitorsecret');
		res.cookie("jwt", token, { expires: new Date(Date.now() + 10*1000*60*60*24)});
		res.redirect('/');
	});

	//TODO: Create better login view, and a route for it here.
	app.get('/login', function(req, res) {
		res.sendfile('./public/login.html');
	});

	// application -------------------------------------------------------------

	app.get('*', function(req, res) {
		//TODO: This should redirect to the login page. The Todos page should passport.authenticate() with 'jwt'.
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};