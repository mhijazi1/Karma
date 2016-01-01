var app = angular.module('Karma', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		});
});

app.controller('mainController', function($scope) {
	$scope.imageVis = false;
	$scope.image = "";
	$scope.prediction = {url: '', result: ''};
	$scope.post = function(){
		$scope.image = $scope.prediction.url;
		$scope.imageVis = true;
	}
});