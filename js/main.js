// define angular app
var app = angular.module( 'forecastApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap'] ).config(function($sceProvider) {
});

// Main controller
app.controller( 'MainCtrl', function( $scope, $parse, $compile, $interpolate, $sce, $http ) {
	$scope.weatherInfo = {};
	$scope.cityDetails = {};

	// today
	var d = new Date();
	$scope.today = d.getDay();


	// define cities obj
	$scope.getLocation = function(val) {
		$scope.selected = undefined;
		$scope.weatherInfo = {};
		$scope.cityDetails = {};
		return $http.jsonp("http://gd.geobytes.com/AutoCompleteCity", {
			params: {
				"q": val,
				"callback": "JSON_CALLBACK"
			}
		}).then(function(res){
			var addresses = res.data;
			return addresses;
		});
	};

	$scope.weekday = function(ep) {
		var n = new Date(ep * 1000);
		n = n.toUTCString().substring(0,3);
		if (n != "Inv") {
			return n;
		}
	};

	$scope.$watch('selected', function(newVal, oldVal){
		if (newVal !== '' && newVal !== undefined) {
			return $http.jsonp("http://gd.geobytes.com/GetCityDetails", {
				params: {
					"fqcn": newVal,
					"callback": "JSON_CALLBACK"
				}
			}).then(function(res){
				$scope.cityDetails = res.data;
				$http.jsonp('http://api.openweathermap.org/data/2.5/forecast/daily', {
					params: {
						//"q": newVal.replace(/^[,\s]+|[,\s]+$/g, ''),
						"lat": $scope.cityDetails.geobyteslatitude,
						"lon": $scope.cityDetails.geobyteslongitude,
						"units": "metric",
						"mode": "json",
						"cnt": 7,
						"callback": "JSON_CALLBACK"
					}
			    }).then(function(res){
			    	$scope.weatherInfo = res.data.list;
			    	//var tomove = $scope.weatherInfo.splice($scope.today, $scope.weatherInfo.length);
			    	console.log($scope.weatherInfo);
			    });
			});
		} else if (newVal == '' || newVal == undefined) {

		}
	});

});

