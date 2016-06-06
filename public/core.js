var scotchTodo = angular.module('scotchTodo', ['ngCookies']);

scotchTodo.controller('mainController', function ($scope, $http, $cookies) {

	if(!$cookies.get('jwt')) {
		window.location.href = '/login';
	}
	else {

		$scope.formData = {};

		// when landing on the page, get all todos and show them
		$http.get('/api/todos', {headers: {'X-Auth-Token': $cookies.get('jwt')}})
			.success(function(data) {
				$scope.todos = data[0].Todos;
			})
			.error(function(data) {
				console.log('Error: ' + data.error.message);
			});

		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {
			$http.post('/api/todos', $scope.formData, {headers: {'X-Auth-Token': $cookies.get('jwt')}})
				.success(function(data) {
					$scope.formData = {}; // clear the form so our user is ready to enter another
					$scope.todos = data[0].Todos;
				})
				.error(function(data) {
					console.log('Error: ' + data.error.message);
				});
		};

		// delete a todo after checking it
		$scope.deleteTodo = function(id) {
			$http.delete('/api/todos/' + id, {headers: {'X-Auth-Token': $cookies.get('jwt')}})
				.success(function(data) {
					$scope.todos = data[0].Todos;
				})
				.error(function(data) {
					console.log('Error: ' + data.error.message);
				});
		};

		$scope.logout = function() {
			$cookies.remove('jwt');
			window.location.href = '/';
		}
	}

});