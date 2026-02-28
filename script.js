mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtLWt5bGUiLCJhIjoiY21rZTR3NW82MDNjazNscHdvZGRoNTJlYyJ9.gXrPIIVvGXk6SEwdzrbd1g';
const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/mapbox/standard',
    center: [-79.380752, 43.660356],
    zoom: 10,
})



const legenditems = [
    { label: '0 - 5', colour: "#ffeda0" },
    { label: '6 - 10', colour: "#feb24c" },
    { label: '11 - 15', colour: "#fc4e2a" },
    { label: '16 +', colour: "hsl(348, 100%, 37%)" }

];

legenditems.forEach(({ label, colour }) => {
    const row = document.createElement('div');
    const colcircle = document.createElement('span');

    colcircle.className = 'legend-colcircle';
    colcircle.style.setProperty('--legendcolour', colour);

    const text = document.createElement('span');
    text.textContent = label;

    row.append(colcircle, text);
    legend.appendChild(row)
})

map.on('load', () => {
    map.addSource('wards-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/SamanthaKyle/Lab3/refs/heads/main/climate_change_data/wards_final.geojson'
    });

    map.addLayer({
        'id': 'wards-fill',
        'type': 'fill',
        'source': 'wards-data',
        'paint': {
            "fill-color":
                ["step",
                    ["get", "num_heat_lands"],
                    "#ffeda0",
                    5, "#ffeda0",
                    10, "#feb24c",
                    15, "#fc4e2a",
                    20, "hsl(348, 100%, 37%)",],
            'fill-outline-color': 'orange',
            'fill-opacity': 0.75

        }
    });

    map.addLayer({
        'id': 'wards-hl',
        'type': 'fill',
        'source': 'wards-data',
        'paint': {
            "fill-color":
                ["step",
                    ["get", "num_heat_lands"],
                    "#ffeda0",
                    5, "#ffeda0",
                    10, "#feb24c",
                    15, "#fc4e2a",
                    20, "hsl(348, 100%, 37%)",],
            'fill-outline-color': 'white',
            'fill-outline-width': 2,
            'fill-opacity': 1,
            'filter': ['==', ['get', 'AREA_NAME'], '']

        }
    });

    map.addSource('heat-points-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/SamanthaKyle/Lab3/refs/heads/main/climate_change_data/heat_locations_updated.geojson'
    });

    map.addLayer({
        'id': 'heat-points',
        'type': 'circle',
        'source': 'heat-points-data',
        'paint': {
            'circle-radius': 5,
            'circle-color': 'rgb(105, 194, 214)',
            'circle-stroke-width': 1,
            'circle-stroke-color': 'white'
        }
    });
});


map.on('mouseenter', 'wards-fill', () => {
    map.getCanvas().style.cursor = 'pointer'; // Switch cursor to pointer when mouse is over provterr-fill layer

});

map.on('mouseleave', 'wards-fill', () => {
    map.getCanvas().style.cursor = ''; // Switch cursor back when mouse leaves provterr-fill layer
    map.setFilter("wards-hl", ['==', ['get', 'AREA_NAME'], '']); // Reset filter for highlighted layer after mouse leaves feature
});
map.on('mousemove', 'wards-fill', (e) => {
    // Set the filter of the provinces-hl to display the feature you're hovering over
    // e.features[0] is the first feature in the array and properties.PRUID is the Province ID for that feature
    map.setFilter('wards-hl', ['==', ['get', 'AREA_NAME'], e.features[0].properties.AREA_NAME]);

});

map.on('click', 'heat-points', (e) => {
    new mapboxgl.Popup() // Declare new popup object on each click
        .setLngLat(e.lngLat) // Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Location</b> " + e.features[0].properties.locationName + "<br>" +
        "Address: " + e.features[0].properties.address + "<br>Feature: " + e.features[0].properties.locationDesc) // Use click event properties to write text for popup
        .addTo(map); // Show popup on map
}); 