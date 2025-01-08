// Store the API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-01&endtime=2021-01-02";

// Perform a GET request to the query URL.
d3.json(queryUrl).then(function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Define a function that runs for each feature in the features array.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`Location: ${feature.properties.place}<br>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km`);
    }

    // Create a GeoJSON layer containing the features array.
    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            // Set the radius based on magnitude and color based on depth.
            let depth = feature.geometry.coordinates[2];
            let magnitude = feature.properties.mag;
            let color = depth > 100 ? 'red' : depth > 50 ? 'orange' : 'yellow';
            let radius = magnitude * 5; // Adjust size factor as necessary

            return L.circleMarker(latlng, {
                radius: radius,
                fillColor: color,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`Location: ${feature.properties.place}<br>Magnitude: ${magnitude}<br>Depth: ${depth} km`);
        },
        onEachFeature: onEachFeature
    });

    // Send our earthquakes layer to the createMap function.
    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    // Create a map object.
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Create a layer control.
    L.control.layers({"Street Map": street}, {"Earthquakes": earthquakes}, {collapsed: false}).addTo(myMap);
}

function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    });

    // Create a map object.
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Create a layer control.
    L.control.layers({"Street Map": street}, {"Earthquakes": earthquakes}, {collapsed: false}).addTo(myMap);

    // Create a legend control.
    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        const depths = [0, 50, 100];
        const labels = [];

        // Loop through depth intervals and generate a label with a colored square for each interval.
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + (depths[i] > 100 ? 'red' : depths[i] > 50 ? 'orange' : 'yellow') + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
        }
        return div;
    };

    legend.addTo(myMap);
}