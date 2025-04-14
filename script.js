// Initialize map
var map = L.map('map').setView([12.9716, 77.5946], 10);

// Tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add search control
L.Control.geocoder().addTo(map);

// Draw control for polygons, circles, etc.
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: true,
        circle: false,
        rectangle: false,
        marker: true
    }
});
map.addControl(drawControl);


// Sample markers with details for Bangalore
var markers = [
    {
        lat: 12.9716,
        lng: 77.5946,
        name: 'Bangalore',
        description: 'Silicon Valley of India'
    },
];

// Add markers with custom icons
var customIcon = L.icon({
    iconUrl: 'https://img.icons8.com/ios/50/000000/marker.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});

markers.forEach(function(marker) {
    var m = L.marker([marker.lat, marker.lng], {icon: customIcon}).addTo(map);
    m.on('click', function() {
        displayLocationInfo(marker);
        map.setView([marker.lat, marker.lng], 10);  // Zoom in on marker
    });
});

// Function to display location info
function displayLocationInfo(marker) {
    var infoContent = `<strong>${marker.name}</strong><br>${marker.description}`;
    document.getElementById('location-details').innerHTML = infoContent;
}

// Show current latitude and longitude on click
map.on('click', function(e) {
    var latLng = e.latlng;
    document.getElementById('location-details').innerHTML = `Lat: ${latLng.lat.toFixed(4)}, Lng: ${latLng.lng.toFixed(4)}`;
});

// Add mouse position control to track lat/lng
L.control.mousePosition().addTo(map);

// Reset map button functionality
document.getElementById('reset-btn').addEventListener('click', function() {
    map.setView([51.505, -0.09], 2);  // Reset to initial world view
    document.getElementById('location-details').innerHTML = 'Click a marker or a location on the map.';
});
