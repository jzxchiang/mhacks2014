'use strict';

angular.module('core').controller('HomeController', ['$scope', '$http', 'Authentication',
	function($scope, $http, Authentication) {
		$scope.tempInterest = undefined;
  		$scope.states = ['Math', 'Baseball', 'Food', 'Cooking', 'Philosophy', 'Literature', 'Physics', 'Video Games', 'Basketball'];
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.credentials = {
			name: '',
			email: '',
			interests: []
		};
		$scope.currentStep = 1;
        
        $scope.addInterest = function () {
            if ($scope.tempInterest) {
                $scope.credentials.interests.push($scope.tempInterest);
                $scope.tempInterest = '';
                angular.element(document.querySelector('#input-one')).removeClass('red-placeholder red-border');
            }
        };

		$scope.checkInterests = function () {
			if ($scope.credentials.interests.length !== 0) {
				$scope.currentStep = 2;
			} else {
				angular.element(document.querySelector('#input-one')).attr('placeholder', 'Please enter at least one interest');
				angular.element(document.querySelector('#input-one')).addClass('red-placeholder red-border');
			}
		};

		$scope.postUser = function () {
			if ($scope.credentials.email && $scope.credentials.name) {
				$http.post('/users', $scope.credentials).success(function(response) {
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;

					// And redirect to the index page
					console.log('hello');
				}).error(function(response) {
					$scope.error = response.message;
				});
				$scope.currentStep = 3;
			} else {
				if (!$scope.credentials.name) {
					angular.element(document.querySelector('#input-two')).attr('placeholder', 'Please enter your name');
					angular.element(document.querySelector('#input-two')).addClass('red-placeholder red-border');

				}
				if (!$scope.credentials.email) {
					angular.element(document.querySelector('#input-three')).attr('placeholder', 'Please enter a valid email');
					angular.element(document.querySelector('#input-three')).addClass('red-placeholder red-border');
				}
			}
		};

        $scope.validateColumbiaEmail = function () {

        };
    }
]);
