'use strict';


angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication',
	function($scope, $http, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.credentials = {
			name: '',
			email: '',
			interests: []
		};
		$scope.currentStep = 1;

		$scope.postUser = function () {
			$http.post('/users', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				console.log('hello');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);