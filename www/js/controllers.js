angular.module('weather.controllers', [])

.controller('MainCtrl', ['$scope', 'WorldWeatherOnline', 'GeoCoder', function($scope, WorldWeatherOnline, GeoCoder) {

	$scope.fetchWeather = function() {

		$scope.weatherfetched = false;

		if ($scope.city != null && $scope.city != '')
		{
			WorldWeatherOnline.getWeather(encodeURI($scope.city)).then(function(data) {
				if (data.weather != null) {
					$scope.weather = data.weather;
					$scope.weatherfetched = true;
					$scope.city = '';
				} else {
					$scope.weatherfetched = false;
				}
			});
			
  		}
	};

	// Get the current GPS coordinates
	navigator.geolocation.getCurrentPosition(onSuccess, onError); 

	function onSuccess(position) {
		// initialize the variable
		$scope.weather = { city: null, image: null, description: null, temperature: null };

		// Get the weather for the current GPS coordinates from WorldWeatherOnline as a promise
		WorldWeatherOnline.getWeather(encodeURI(position.coords.latitude + ',' + position.coords.longitude )).then(function(data) {
			$scope.weather = data.weather;
			// Then get the city name for the current coordinates from Google Geocoder
			GeoCoder.getAddressFromCoordinates(position.coords.latitude, position.coords.longitude).then(function(data) {
				$scope.weather.city = data.address;
				$scope.weatherfetched = true;
			});
		});

	}

	function onError(error) {
		alert('ERROR!\n\ncode: ' + error.code + '\n' + 'message: ' + error.message + '\n');
	}

}]);
