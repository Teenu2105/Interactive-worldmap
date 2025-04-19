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

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to add circles at each vertex of a polygon with random colors
function addCirclesForPolygon(latlngs) {
    latlngs[0].forEach(function (latlng) {
        var randomColor = getRandomColor();
        var circle = L.circle(latlng, {
            color: randomColor,
            fillColor: randomColor,
            fillOpacity: 0.8,
            radius: 5
        }).addTo(map);
    });
}

// Function to add a circle for a marker with a random color
function addCircleForMarker(latlng) {
    var randomColor = getRandomColor();
    L.circle(latlng, {
        color: randomColor,
        fillColor: randomColor,
        fillOpacity: 0.8,
        radius: 5
    }).addTo(map);
}

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
    console.log("Saved data:", data); // Debugging log
    alert("Map data saved successfully!");
}

// Function to load data from local storage
function loadDataFromLocalStorage() {
    var data = localStorage.getItem('mapData');
    console.log("Loaded data:", data); // Debugging log

    if (data) {
        // Parse the saved data
        JSON.parse(data).forEach(function (item) {
            if (item.type === 'polygon') {
                // Load polygon
                var polygon = L.polygon(item.latlngs).addTo(map);
                drawnItems.addLayer(polygon);

                // Add circles for each point in the polygon
                addCirclesForPolygon(item.latlngs);
            } else if (item.type === 'marker') {
                // Load marker
                var marker = L.marker(item.latlng).addTo(map);
                drawnItems.addLayer(marker);

                // Add a circle for the marker
                addCircleForMarker(item.latlng);
            }
        });
    } else {
        console.log("No data found in localStorage.");
    }
}

// Load data when the page is loaded
loadDataFromLocalStorage();

// Handle draw:created event to add layers
map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;

    if (layer instanceof L.Polygon) {
        // Add circles for each point in the polygon
        addCirclesForPolygon(layer.getLatLngs());
    } else if (layer instanceof L.Marker) {
        // Add a circle for the marker
        addCircleForMarker(layer.getLatLng());
    }

    drawnItems.addLayer(layer);
});

// Add event listener for the "Save" button
document.getElementById('save-btn').addEventListener('click', saveDataToLocalStorage);