// Initialize map
var map = L.map('map').setView([12.9716, 77.5946], 10);

// Tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add search control
L.Control.geocoder().addTo(map);

// Feature group for drawn items
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Draw control
var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
        polygon: true,
        marker: true,
    }
});
map.addControl(drawControl);

// Function to save data to local storage
function saveDataToLocalStorage() {
    var data = [];

    // Save all drawn layers (polygons and markers)
    drawnItems.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
            data.push({
                type: 'polygon',
                latlngs: layer.getLatLngs()
            });
        } else if (layer instanceof L.Marker) {
            data.push({
                type: 'marker',
                latlng: layer.getLatLng()
            });
        }
    });

    localStorage.setItem('mapData', JSON.stringify(data));
}

// Function to load data from local storage
function loadDataFromLocalStorage() {
    var data = localStorage.getItem('mapData');
    if (data) {
        JSON.parse(data).forEach(function (item) {
            if (item.type === 'polygon') {
                var polygon = L.polygon(item.latlngs).addTo(map);
                drawnItems.addLayer(polygon);
            } else if (item.type === 'marker') {
                var marker = L.marker(item.latlng).addTo(map);
                drawnItems.addLayer(marker);
            }
        });
    }
}

// Load data when the page is loaded
loadDataFromLocalStorage();

// Handle draw:created event to save polygons and markers
map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    drawnItems.addLayer(layer);

    // Save the newly added data
    saveDataToLocalStorage();
});

// Save data whenever an edit or delete action occurs
map.on(L.Draw.Event.EDITED, saveDataToLocalStorage);
map.on(L.Draw.Event.DELETED, saveDataToLocalStorage);