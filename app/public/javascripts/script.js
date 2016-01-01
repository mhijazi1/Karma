var app = angular.module('Karma', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		});
});

app.controller('mainController', function($scope) {
	$scope.image = "http://i2.cdn.turner.com/cnnnext/dam/assets/130410081024-obama-serious-face-horizontal-large-gallery.jpg";
	$scope.url2 = "Abc123";
	$scope.prediction = {url: '', result: ''};
	$scope.post = function(){
		$scope.url2 = $scope.prediction.url;
		$scope.image = $scope.prediction.url;
	}
});