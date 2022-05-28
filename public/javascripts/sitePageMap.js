mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campground.geometry.coordinates,
    zoom: 11 // higher number => more zoom
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 30})
            .setHTML(`<h5>${campground.title}</h5>`)
    )
    .addTo(map);