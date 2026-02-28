mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtLWt5bGUiLCJhIjoiY21rZTR3NW82MDNjazNscHdvZGRoNTJlYyJ9.gXrPIIVvGXk6SEwdzrbd1g';

const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/mapbox/standard',
    center: [-79.380752, 43.660356], 
    zoom: 10,
})

map.on('load', () =>{
    map.addSource('wards-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/SamanthaKyle/Lab3/refs/heads/main/climate_change_data/wards_updated.geojson'
    });

    map.addLayer({
        'id': 'wards',
        'type': 'fill',
        'source': 'wards-data',
        'paint': {
            'fill-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'num_heat_lands'], // GET expression retrieves property value from 'capacity' data field
                '#800026', // Colour assigned to any values < first step
                5, '#bd0026', // Colours assigned to values >= each step
                10, '#e31a1c',
                15, '#fc4e2a',
                20, '#fd8d3c'
            ],
        },
    })

    map.addSource('heat-points-data', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/SamanthaKyle/Lab3/refs/heads/main/climate_change_data/heat_locations_updated.geojson'
    });

    map.addLayer({
        'id': 'heat-points',
        'type' : 'circle',
        'source': 'heat-points-data',
        'paint': {
            'circle-radius': 5,
            'circle-color': 'blue'
        }
    });
})