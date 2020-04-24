var latI;
var latL;
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.731, lng: -73.997}
  });
  var geocoder = new google.maps.Geocoder;

  document.getElementById('submit').addEventListener('click', function() {
    geocodeLatLng(geocoder, latI, latL);
  });
}

function geocodeLatLng(geocoder, latI, latL) {
  var latlng = {lat: parseFloat(latI), lng: parseFloat(latL)};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        document.getElementById('location_Name').value = results[0].formatted_address;
        console.log(results[0].formatted_address);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

let geolocation = navigator.geolocation;
if (geolocation) {
  console.log("OK");
} else {
  console.log("Không hỗ trợ");
}

function onGeoSuccess(position) {
  latI = position.coords.latitude;
  latL = position.coords.longitude;
}
function onGeoError(error) {
  let detailError;

  if(error.code === error.PERMISSION_DENIED) {
    detailError = "User denied the request for Geolocation.";
  }
  else if(error.code === error.POSITION_UNAVAILABLE) {
    detailError = "Location information is unavailable.";
  }
  else if(error.code === error.TIMEOUT) {
    detailError = "The request to get user location timed out."
  }
  else if(error.code === error.UNKNOWN_ERROR) {
    detailError = "An unknown error occurred."
  }

  $("#error").innerHTML = `Error: ${detailError}`;
}
let options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
geolocation.getCurrentPosition(onGeoSuccess, onGeoError, options);