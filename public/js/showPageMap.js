mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl())

//Make a marker
new mapboxgl.Marker()
    //Set the correct longitate and latitude
    .setLngLat(campground.geometry.coordinates)
    //Set the popup on that marker when a user clicks on it
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h4>${campground.title}</h4><p>${campground.location}</p>`
        )
    )
    //Finally, add the marker to the map
    .addTo(map)