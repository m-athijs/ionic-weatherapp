// Testing Git stuff...
angular.module('weather.services', [])

.factory('WorldWeatherOnline', ['$http', '$q', function($http, $q) {
	var apiUrl = 'http://api.worldweatheronline.com/free/v2/weather.ashx?format=json&num_of_days=1&key=131501a927f432f935086da58d7be&q=';

	return {
		getWeather: function(query) {
			var deferred = $q.defer();

			$http.get(apiUrl + query).
				success(function(data, status, headers, config) {
					if (data.data.error) {
						deferred.resolve( { weather: null });
					} else {
						deferred.resolve( { weather: {
							city: data.data.request[0].query,
							image: data.data.current_condition[0].weatherIconUrl[0].value,
							description: data.data.current_condition[0].weatherDesc[0].value,
							temperature: data.data.current_condition[0].temp_C
						} });
					}
				}).
				error(function(data, status, headers, config) {
					alert(status);
				})

			return deferred.promise;
		}
	}
}])

.factory('GeoCoder', ['$q', function($q){
	return {
		getAddressFromCoordinates: function(lat, lng) {
			var deferred = $q.defer();

			var geocoder = new google.maps.Geocoder();
			var latlng = new google.maps.LatLng(lat, lng);
			geocoder.geocode({'latLng': latlng}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						deferred.resolve({ address: results[1].formatted_address });
					} else {
						deferred.resolve({ address: '' });
					}
				} else {
					deferred.reject({ address: status })
				}
			});

			return deferred.promise;
		}
	}
}])

.factory('LocalStorage', ['$window', function($window){
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.factory('SavedLocations', ['LocalStorage', function(LocalStorage) {
	var selectedSavedLocationCity = null;
	return {
		getSavedLocations: function() {
			return LocalStorage.getObject('savedLocations');
		},
		setSelectedSavedLocation: function(city) {
			selectedSavedLocationCity = city;
		},
		getSelectedSavedLocation: function() {
			return selectedSavedLocationCity
		},
		addSavedLocation: function(city) {
			var savedLocations = LocalStorage.getObject('savedLocations');
			if (Array.isArray(savedLocations)) {
				if (savedLocations.indexOf(city) == -1) {
					savedLocations.push(city);
				}
			} else {
				savedLocations = [city];
			}
			LocalStorage.setObject('savedLocations', savedLocations);
		},
		removeSavedLocation: function(index) {
			var savedLocations = LocalStorage.getObject('savedLocations');
			savedLocations.splice(index, 1);
			LocalStorage.setObject('savedLocations', savedLocations);
		}
	}
}]);
