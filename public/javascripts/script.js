var app = angular.module('Karma', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		});
});

app.controller('mainController', function($scope) {
	//authenticate with clarifai application
	clarifai = new Clarifai({
		'clientId': 'Qu6z2uKlfDgqa7Atn1HlOBa3pakRBQHflQicLNr_',
		'clientSecret': '8WgQ8D4Dp9IW1JilxEfjXjgg1geq1zpaeT3P7Rk3'
	});


	//make image invisible
	$scope.imageVis = false;
	$scope.damaged = false;
	$scope.undamaged = false;
	$scope.image = "";
	$scope.prediction = {
		url: '',
		result: ''
	};

	$scope.post = function() {
		//get url
		$scope.image = $scope.prediction.url;
		//run prediction for perfect
		clarifai.predict($scope.image, 'perfect', function(obj) {
			//get score
			$scope.perfect = obj.score * 100;

			//run prediction for dent
			clarifai.predict($scope.image, 'dent', function(obj) {
				//get score
				$scope.dent = obj.score * 100;

				if ($scope.dent >= $scope.perfect) {
					$scope.damaged = true;
				} else {
					$scope.undamaged = true;
				}
				$scope.imageVis = true;
				$scope.$apply();

			});
		});
	}
});

function cb(obj) {
	console.log('cb', obj);
}