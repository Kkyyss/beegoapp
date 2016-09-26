var address = '';
function initMap() {
  // Create a map object and specify the DOM element for display.
  var myLatLng = {lat: -33.866, lng: 151.196};
  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 15,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeId: 'roadmap',
  });

  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var infowindow = new google.maps.InfoWindow();
  var markers = []; 

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    address = places[0].formatted_address;
  });
}

var locBtn = document.getElementById('loc-btn');
locBtn.addEventListener("click", function(ev) {
  ev.preventDefault();
  var locationOverlay = document.getElementById('bg-overlay');
  var locationBox = document.getElementById('location-box');
  var userLocation = document.getElementById('user-location');
  if (address.length == 0) {
    return;
  } else {
    locationOverlay.style.display = 'none';
    locationBox.style.display = 'none';
    userLocation.value = address;
    userLocation.focus();
    userLocation.blur();
  }
});
