// Initialize the Leaflet map centered on Saint Louis
var map = L.map('map').setView([38.6270, -90.1994], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: 'OpenStreetMap, CartoDB',
    maxZoom: 19
}).addTo(map);


// Load GeoJSON for Saint Louis Parks
$.getJSON("https://raw.githubusercontent.com/ashutosh-pawar-rsl/adv-prog-project1-datadump/main/stl_parks.json", function(parkData) {
    L.geoJson(parkData, {
        style: function(feature) {
            return {
                color: "#006400", // Border color of the parks
                fillColor: "#66CDAA", // Fill color of the parks
                fillOpacity: 0.1, // Fill opacity of the parks
                weight: 2 // Border width of the parks
            };
        }
    }).addTo(map);
});

// Load GeoJSON for Saint Louis Streets
$.getJSON("https://raw.githubusercontent.com/ashutosh-pawar-rsl/adv-prog-project1-datadump/main/park_paths.geojson", function(streetData) {
    L.geoJson(streetData, {
        style: function(feature) {
            return {color: "#006400", weight: 1};
        }
    }).addTo(map);
});

// Load and style GeoJSON for Saint Louis and Saint Louis University Boundaries
$.getJSON("https://raw.githubusercontent.com/ashutosh-pawar-rsl/adv-prog-project1-datadump/main/slu_stl_boundary.json", function(data) {
    L.geoJson(data, {
        style: function(feature) {
            return {
                color: "#00008B", // Dark blue color for the boundary lines
                weight: 2,
                opacity: 1,
                fillOpacity: 0
            };
        }
    }).addTo(map);
});

// Define icon URLs and descriptive names
var iconUrls = {
    '0': 'https://cdn2.iconfinder.com/data/icons/camping-hiking-5/128/6-512.png',
    '1': 'https://cdn-icons-png.flaticon.com/512/1825/1825754.png',
    '2': 'https://static.thenounproject.com/png/1214879-200.png',
    '3': 'https://cdn-icons-png.flaticon.com/512/82/82436.png',
    '4': 'https://cdn-icons-png.flaticon.com/512/1010/1010398.png',
    'Null': 'https://cdn-icons-png.flaticon.com/512/3864/3864600.png'
};

var typeDescriptions = {
    '0': 'Picnic Table',
    '1': 'Bench',
    '2': 'Table/Chairs',
    '3': 'Other Seat',
    '4': 'Couch',
    'Null': 'Hammock'
};

// Function to get the icon based on the seating type
function getIcon(type) {
    var iconUrl = iconUrls[type] || iconUrls['Null'];
    return L.icon({
        iconUrl: iconUrl,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
}

// Load GeoJSON and customize markers for seating
$.getJSON("https://raw.githubusercontent.com/ashutosh-pawar-rsl/adv-prog-project1-datadump/main/slu_seating.geojson", function(data) {
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            var type = feature.properties.TYPE_SEAT || 'Null';
            var markerIcon = getIcon(type);
            return L.marker(latlng, {icon: markerIcon});
        },
        onEachFeature: function(feature, layer) {
            var type = feature.properties.TYPE_SEAT || 'Null';
            var description = typeDescriptions[type];
            var popupContent = "Seating Type: " + description;
            layer.bindPopup(popupContent);
        }
    }).addTo(map);
});

// Add a legend to the map
var legend = L.control({position: 'bottomright'});
legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        types = ['0', '1', '2', '3', '4', 'Null'], // Seating types
        labels = ['Picnic Table', 'Bench', 'Table/Chairs', 'Other Seat', 'Couch', 'Hammock'],
        icons = [
            'https://cdn2.iconfinder.com/data/icons/camping-hiking-5/128/6-512.png',
            'https://cdn-icons-png.flaticon.com/512/1825/1825754.png',
            'https://static.thenounproject.com/png/1214879-200.png',
            'https://cdn-icons-png.flaticon.com/512/82/82436.png',
            'https://cdn-icons-png.flaticon.com/512/1010/1010398.png',
            'https://cdn-icons-png.flaticon.com/512/3864/3864600.png'
        ];

    div.innerHTML = '<h4>Seating Types</h4>';
    types.forEach(function(type, index) {
        div.innerHTML += ("<img src=" + icons[index] + " height='24' width='24'> ") + labels[index] + '<br>';
    });

    return div;
};
legend.addTo(map);

document.getElementById('gotoSLU').addEventListener('click', function() {
    map.setView([38.6365, -90.2342], 17); // Centers the map on SLU 
});

document.getElementById('gotoForestPark').addEventListener('click', function() {
    map.setView([38.6367, -90.2876], 15); // Centers the map on Forest Park 
});
