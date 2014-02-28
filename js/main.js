// define angular app
var app = angular.module( 'forecastApp', ['ngRoute', 'ngSanitize'] ).config(function($sceProvider) {
	$sceProvider.enabled(false);
});

app.factory('forecastData', function($http, $q) {
	return {
		getCities: function(){
			// creating a deferred object for promise
			var deferred = $q.defer();

			// call forecast api for data
			$http({
				method: 'jsonp',
				url: 'http://api.openweathermap.org/data/2.1/forecast/city?q=Moscow'
			}).success(function(data){
				//console.log(data);
				data = data.substring(1);
				data = data.substring(0, (data.length-1));
				deferred.resolve($.parseJSON(data));
			}).error(function(){
				// failure
				deferred.reject("An error occured while fetching items");
			});

			// return promise
			return deferred.promise;
		}
  	}
});

// Main controller
app.controller( 'MainCtrl', function( $scope, $parse, $compile, $interpolate, $sce, forecastData ) {
	
	// define cities obj
	$scope.cities = {};

	// define init function to run when angular's ready
	$scope.init = function() {

		forecastData.getCities().then(function(data){
			$scope.cities = data;
		}, function(error){
			$scope.err = error;
		});

	};

	// start up
	$scope.init();

});

$(function(){
});
