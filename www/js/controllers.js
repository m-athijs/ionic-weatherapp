angular.module('weather.controllers', [])

.controller('SearchCtrl', ['$scope', '$state', '$stateParams', 'WorldWeatherOnline', 'GeoCoder', 'SavedLocations', function($scope, $state, $stateParams, WorldWeatherOnline, GeoCoder, SavedLocations) {

	init();

	function init() {
		// initialize the variables
		$scope.weather = { city: null, image: null, description: null, temperature: null, searchterm: null };
		var selectedSavedLocation = SavedLocations.getSelectedSavedLocation();
		if (selectedSavedLocation != null) {
			$scope.weather.searchterm = selectedSavedLocation;
			getWeather(selectedSavedLocation);
		} else {
			navigator.geolocation.getCurrentPosition(onSuccess, onError);
		}
	}

	$scope.fetchWeather = function(city) {
		getWeather(city);
	};

	function getWeather(city) {
		$scope.weatherfetched = false;

		if (city != null && city != '')
		{
			WorldWeatherOnline.getWeather(encodeURI(city)).then(function(data) {
				if (data.weather != null) {
					$scope.weather = data.weather;
					//vm.weather = data.weather;
					$scope.weatherfetched = true;
				} else {
					$scope.weatherfetched = false;
				}
			});
		}
	}

	$scope.saveLocation = function() {
		SavedLocations.addSavedLocation($scope.weather.city);
		// Show the Saved Locations tabs
		$state.go('tab.saved');
	};

	function onSuccess(position) {

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

}])

.controller('SavedCtrl', ['$scope', '$state', '$location', 'SavedLocations', function($scope, $state, $location, SavedLocations) {

	init();

	function init() {
		$scope.showHide = "Show";
		$scope.savedLocations = SavedLocations.getSavedLocations();
	}

	$scope.removeSavedLocation = function(index) {
		SavedLocations.removeSavedLocation(index);
		$scope.savedLocations = SavedLocations.getSavedLocations();
	};

	$scope.showHideDeleteButtons = function() {
		$scope.showDelete = !$scope.showDelete;
		if ($scope.showHide == "Show") {
			$scope.showHide = "Hide";
		} else {
			$scope.showHide = "Show";
		}
	};

	$scope.getWeatherWithCity = function(savedLocation) {
		SavedLocations.setSelectedSavedLocation(savedLocation);
		$state.go('tab.search');
	};

}]);
