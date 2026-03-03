mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtLWt5bGUiLCJhIjoiY21rZTR3NW82MDNjazNscHdvZGRoNTJlYyJ9.gXrPIIVvGXk6SEwdzrbd1g';

// Create map object in my map container, using default style
const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/mapbox/standard',
    center: [-79.380752, 43.660356],
    zoom: 10,
})


// array of legend items including label and colour
const legenditems = [
    { label: '0 - 5', colour: "#ffeda0" },
    { label: '6 - 10', colour: "#feb24c" },
    { label: '11 - 15', colour: "#fc4e2a" },
    { label: '16 +', colour: "hsl(348, 100%, 37%)" }

];

// iterate over legend items, creating elements to display their information
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

// add full-screen capability
map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('my-map') }));

// actions to occur when the map first loads
map.on('load', () => {

    // an alert to tell the user how to use the map
    alert('Here is how to use the map!\nHover and check the legend to see the number of heat relief sites per ward.\nClick on the site points to learn more')
    
    // wards data
    map.addSource('wards-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/SamanthaKyle/Lab3/refs/heads/main/climate_change_data/wards_final.geojson'
    });

    // total wards data, with colour steps to show number of heat relief sites
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

    // extra layer to allow for hover-filtering 
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
            // default setting so it filters out everything until first prompted
            'filter': ['==', ['get', 'AREA_NAME'], '']

        }
    });

    // point data
    map.addSource('heat-points-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/SamanthaKyle/Lab3/refs/heads/main/climate_change_data/heat_locations_updated.geojson'
    });

    // add points to map
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

    // layer for point labels
    map.addLayer({
        "id": "heat-point-label",
        "type": "symbol",
        "source": "heat-points-data",
        "layout": {
            "icon-image": "marker-15",
            // text field to display below points
            "text-field": "{locationDesc}",
            "text-anchor": "top",
            "text-size": {
                // this allows the labels to be invisible until zoom level 11 and up to size 10 as they zoom
                "stops": [
                    [0, 0],
                    [11, 0],
                    [11.1, 10]
                ]
            }
        }
    });
});

// when a mouse hovers over a ward, change pointer style
map.on('mouseenter', 'wards-fill', () => {
    map.getCanvas().style.cursor = 'pointer'; // Switch cursor to pointer when mouse is over provterr-fill layer

});
// as mouse moves over a ward, change the filter to fetch this feature's name and highlight it with the highlight layer
map.on('mousemove', 'wards-fill', (e) => {
    map.setFilter('wards-hl', ['==', ['get', 'AREA_NAME'], e.features[0].properties.AREA_NAME]);

});

// reset the filter when mouse leaves
map.on('mouseleave', 'wards-fill', () => {
    map.getCanvas().style.cursor = ''; // Switch cursor back when mouse leaves provterr-fill layer
    map.setFilter("wards-hl", ['==', ['get', 'AREA_NAME'], '']); // Reset filter for highlighted layer after mouse leaves feature
});

// clicking on a heat point will show more information in a popup
map.on('click', 'heat-points', (e) => {
    new mapboxgl.Popup() // Declare new popup object on each click
        .setLngLat(e.lngLat) // Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Location</b> " + e.features[0].properties.locationName + "<br>" +
            "Address: " + e.features[0].properties.address + "<br>Feature: " + e.features[0].properties.locationDesc) // Use click event properties to write text for popup
        .addTo(map); // Show popup on map
}); 