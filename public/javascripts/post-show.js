mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2bW5xb2JpIiwiYSI6ImNrOXZzampydzAyN3kzbW9neHVwNXhyNHIifQ.n6KBbWM55bcxhBIiLndN5Q';

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v10',
	center: post.geometry.coordinates,
	zoom: 5
});

// create a HTML element for our post location/markers
var el = document.createElement('div');
el.className = 'marker';

// make a marker for our location and add to the map
new mapboxgl.Marker(el)
.setLngLat(post.geometry.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
.setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))	
.addTo(map);

// toggle edit review form
$('.toggle-edit-form').on('click', function() {
	// toggle the edit button text on click
	$(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
	// toggle visibility of the edit review form
	$(this).siblings('.edit-review-form').toggle();
});

// add click listener for clearing of rating from edit/new form
$('.clear-rating').click(function() {
	$(this).siblings('.input-no-rate').click();
});