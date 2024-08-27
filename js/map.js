
// Initialize the map
var map = L.map('map').setView([20.947687, 95.967537], 6); 


// Add a tile layer
var tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
    maxZoom: 20
}).addTo(map);

// Add PNG image overlay
var imageBounds = [[28.5495834155181427, 92.1904163081435115], [8.8162501611181412, 101.1737496055435201]];
var populationDensityOverlay = L.imageOverlay('geojson/mmr_pd_2020_1km1.png', imageBounds);

// Custom Legend Control
var PopulationDensityLegend = L.Control.extend({
    onAdd: function(map) {
        var div = L.DomUtil.create('div', 'population-density-legend');
        div.innerHTML = '<h4>Population Density</h4>' +
            '<i style="background: #fcfbfd"></i> 0<br>' +
            '<i style="background: #dcdbec"></i> <75 per square km<br>' +
            '<i style="background: #a39fcb"></i> <150 per square km<br>' +
            '<i style="background: #6a51a3"></i> <225 per square km<br>' +
            '<i style="background: #3f007d"></i> >300 per square km';
        return div;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

var populationDensityLegend = new PopulationDensityLegend({ position: 'bottomleft' });


// Event listeners to toggle legend visibility
map.on('overlayadd', function(eventLayer) {
    if (eventLayer.name === 'Population Density (2020)') {
        populationDensityLegend.addTo(map);
    }
});

map.on('overlayremove', function(eventLayer) {
    if (eventLayer.name === 'Population Density (2020)') {
        map.removeControl(populationDensityLegend);
    }
});

// Styling functions
function style_mmr_admin0(feature) {
    return {
        color: "#232323",
        weight: 0.26,
        fillOpacity: 0,
    };
}

function style_ero_controlled(feature) {
    if (feature.properties.ero === 'y') {
        return {
            color: "Red",
            weight: 1,
            fillOpacity: 0.01,
        };
    } else {
        return {
            opacity: 0,
            fillOpacity: 0,
        };
    }
}

function style_alternative(feature) {
    if (!feature.properties.Alternativ) {
        return {
            fillColor: '#bb25d9',
            color: '#232323',
            weight: 1,
            fillOpacity: 0.5
        };
    }
    switch (feature.properties.Alternativ) {
        case 'China wifi cable':
            return {
                //fillColor: 'url(#hashedPatternChinaWifi)',
                fillColor: '#6A3E98',
                color: '#1e8a15',
                weight: 2,
                fillOpacity: 0.5
            };
        case 'Foreign SIM':
            return {
                //fillColor: 'url(#hashedPatternForeignSim)',
                fillColor: '#8B1DFF',
                color: '#f0aa07',
                weight: 2,
                fillOpacity: 0.5
            };
        case 'Satellite Internet':
            return {
                //fillColor: 'url(#hashedPatternSatellite)',
                fillColor: '#BA77FF',
                color: '#0d0dd4',
                weight: 2,
                fillOpacity: 0.5
            };
        default:
            return {
                fillColor: '#bb25d9',
                color: '#232323',
                weight: 1,
                fillOpacity: 0.5
            };
    }
}

function style_Internet_connectivity(feature) {
    switch (feature.properties.status) {
        case 'Activated Area':
            return {
                fillColor: "#0D7E3F",
                fillOpacity: 0.5,
                color: 'transparent'
            };
        case 'Do Not Know':
            return {
                fillColor: "#FB8111",
                fillOpacity: 0.5,
                color: 'transparent'
            };
        case 'Internet Blackout':
            return {
                fillColor: "#666666",
                fillOpacity: 0.5,
                color: 'transparent'
            };
        case 'Mobile Phone & Internet Blackout':
            return {
                fillColor: "#222222",
                fillOpacity: 0.5,
                color: 'transparent'
            };
        case 'Only 2G Available':
            return {
                fillColor: "#FBC011",
                fillOpacity: 0.5,
                color: 'transparent'
            };
    }
}
// Function to bind pop-ups to features
function onEachFeature(feature, layer) {
    if (feature.properties) {
        var popupContent = `
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Internet Status:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.status || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>State & Region:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.ST || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>District:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.DT || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Township:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties.TS || 'N/A'}</td>
                </tr>
            </table>
        `;
        layer.bindPopup(popupContent);
    }
}


// Create layer groups for each sub-category
var activatedAreaLayer = new L.GeoJSON.AJAX("geojson/internet_connectivity.geojson", {
    style: function (feature) {
        if (feature.properties.status === 'Activated Area') return style_Internet_connectivity(feature);
    },
    filter: function (feature) {
        return feature.properties.status === 'Activated Area';
    },
    onEachFeature: onEachFeature
});

var doNotKnowLayer = new L.GeoJSON.AJAX("geojson/internet_connectivity.geojson", {
    style: function (feature) {
        if (feature.properties.status === 'Do Not Know') return style_Internet_connectivity(feature);
    },
    filter: function (feature) {
        return feature.properties.status === 'Do Not Know';
    },
    onEachFeature: onEachFeature
});

var internetBlackoutLayer = new L.GeoJSON.AJAX("geojson/internet_connectivity.geojson", {
    style: function (feature) {
        if (feature.properties.status === 'Internet Blackout') return style_Internet_connectivity(feature);
    },
    filter: function (feature) {
        return feature.properties.status === 'Internet Blackout';
    },
    onEachFeature: onEachFeature
});

var mobilePhoneAndInternetBlackoutLayer = new L.GeoJSON.AJAX("geojson/internet_connectivity.geojson", {
    style: function (feature) {
        if (feature.properties.status === 'Mobile Phone & Internet Blackout') return style_Internet_connectivity(feature);
    },
    filter: function (feature) {
        return feature.properties.status === 'Mobile Phone & Internet Blackout';
    },
    onEachFeature: onEachFeature
});

var only2GAvailableLayer = new L.GeoJSON.AJAX("geojson/internet_connectivity.geojson", {
    style: function (feature) {
        if (feature.properties.status === 'Only 2G Available') return style_Internet_connectivity(feature);
    },
    filter: function (feature) {
        return feature.properties.status === 'Only 2G Available';
    },
    onEachFeature: onEachFeature
});

// Create layer groups for alternative internet categories
var chinaWifiCableLayer = new L.GeoJSON.AJAX("geojson/alternative_1.geojson", {
    style: function (feature) {
        if (feature.properties.Alternativ === 'China wifi cable') return style_alternative(feature);
    },
    filter: function (feature) {
        return feature.properties.Alternativ === 'China wifi cable';
    }
});

var foreignSimLayer = new L.GeoJSON.AJAX("geojson/alternative_1.geojson", {
    style: function (feature) {
        if (feature.properties.Alternativ === 'Foreign SIM') return style_alternative(feature);
    },
    filter: function (feature) {
        return feature.properties.Alternativ === 'Foreign SIM';
    }
});

var satelliteInternetLayer = new L.GeoJSON.AJAX("geojson/alternative_1.geojson", {
    style: function (feature) {
        if (feature.properties.Alternativ === 'Satellite Internet') return style_alternative(feature);
    },
    filter: function (feature) {
        return feature.properties.Alternativ === 'Satellite Internet';
    }
});


// Create a new layer group for the population density overlay
var populationDensityLayer = L.layerGroup([populationDensityOverlay]);

// Create layer groups for resistance control area
var eroControlledLayer = new L.GeoJSON.AJAX("geojson/ero_controlled.geojson", {
    style: style_ero_controlled,
    onEachFeature: onEachFeature
});

// Create base and overlay layer objects
var baseLayers = {};
var overlayLayers = {
    "Population Density (2020)": populationDensityLayer
};


// Add layers to the map
activatedAreaLayer.addTo(map);
doNotKnowLayer.addTo(map);
internetBlackoutLayer.addTo(map);
mobilePhoneAndInternetBlackoutLayer.addTo(map);
only2GAvailableLayer.addTo(map);
chinaWifiCableLayer.addTo(map);
foreignSimLayer.addTo(map);
satelliteInternetLayer.addTo(map);

// Create a geolocation button
var geolocateButton = L.control({ position: 'topleft' });

geolocateButton.onAdd = function (map) {
    var btn = L.DomUtil.create('button', 'leaflet-control-geolocate');
    btn.innerHTML = 'Locate Me';
    btn.title = 'Locate your current position';

    L.DomEvent.on(btn, 'click', geolocate, this);
    return btn;
};

geolocateButton.addTo(map);

function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var latlng = [position.coords.latitude, position.coords.longitude];

            var accuracy = position.coords.accuracy;

            // Add a marker indicating the user's position
            var marker = L.marker(latlng).addTo(map);
            marker.bindPopup("You are within " + accuracy + " meters from this point").openPopup();

            // Optionally, zoom to the user's location
            map.setView(latlng, 13);
        }, function (error) {
            alert("Geolocation failed: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
// Create a custom control to extend L.Control.Layers
L.Control.LayersCustom = L.Control.Layers.extend({
    _addItem: function (obj) {
        var label = document.createElement('label'),
            container;

        // Create a span for the layer name
        var name = document.createElement('span');
        name.innerHTML = ' ' + obj.name;

        // Create the legend square
        var legend = document.createElement('span');
        legend.style.display = 'inline-block';
        legend.style.width = '16px'; // Adjust size if needed
        legend.style.height = '16px'; // Adjust size if needed
        legend.style.marginRight = '4px'; // Space between legend and name
        legend.style.border = '1px solid #ddd'; // Optional border
        legend.style.backgroundColor = 'transparent'; // Default color
        legend.style.transition = 'background-color 0.3s'; // Smooth color transition

        // Apply styles based on layer type
        switch (obj.name) {
            case 'Active Areas':
                legend.style.backgroundColor = '#0D7E3F';
                break;
            case 'Unreported Areas':
                legend.style.backgroundColor = '#FB8111';
                break;
            case 'Internet Blackout':
                legend.style.backgroundColor = '#666666';
                break;
            case 'Mobile & Internet Blackout Areas':
                legend.style.backgroundColor = '#222222';
                break;
            case 'Intermittent Service Areas':
                legend.style.backgroundColor = '#FBC011';
                break;
            case 'Resistance Control Area':
                legend.style.border = '2px solid red';
                legend.style.backgroundColor = 'transparent';
                break;
            case 'Non-Domestic WIFI':
                legend.style.backgroundImage = 'url(#hashedPatternChinaWifi)';
                break;
            case 'Non-Domestic Mobile':
                legend.style.backgroundImage = 'url(#hashedPatternForeignSim)';
                break;
            case 'Localized Satellite Internet':
                legend.style.backgroundImage = 'url(#hashedPatternSatellite)';
                break;
            default:
                legend.style.backgroundColor = 'transparent';
        }

        label.style.display = 'block';
        label.style.marginBottom = '8px'; // Space between layers
        label.style.padding = '4px'; // Padding around the label
        label.style.cursor = 'pointer'; // Pointer cursor on hover
        label.style.borderRadius = '8px'; // Rounded corners for all labels

        label.appendChild(legend);
        label.appendChild(name);

        var container = obj.overlay ? this._overlaysList : this._baseLayersList;
        container.appendChild(label);

        // Add click event to toggle layer visibility
        L.DomEvent.on(label, 'click', function () {
            var layer = obj.layer;
            if (this._map.hasLayer(layer)) {
                this._map.removeLayer(layer);
                label.style.backgroundColor = 'transparent'; // Remove highlight
            } else {
                this._map.addLayer(layer);
                label.style.backgroundColor = '#E8E8E8'; // Highlight
                label.style.borderRadius = '8px'; // Apply rounded corners to highlighted label
            }
        }, this);

        // Set initial highlight state based on whether the layer is already added
        if (this._map.hasLayer(obj.layer)) {
            label.style.backgroundColor = '#E8E8E8'; // Highlight
            label.style.borderRadius = '8px'; // Rounded corners for initially highlighted label
        } else {
            label.style.backgroundColor = 'transparent'; // No highlight
        }

        return label;
    }
});

// Initialize custom layer controls without checkboxes

var projectTitleControl = new L.Control.LayersCustom(null, {
}, { collapsed: false }).addTo(map);
projectTitleControl.getContainer().classList.add('project-title');

var internetConnectivityControl = new L.Control.LayersCustom(null, {
    "Active Areas": activatedAreaLayer,
    "Unreported Areas": doNotKnowLayer,
    "Internet Blackout": internetBlackoutLayer,
    "Mobile & Internet Blackout Areas": mobilePhoneAndInternetBlackoutLayer,
    "Intermittent Service Areas": only2GAvailableLayer
}, { collapsed: false }).addTo(map);
internetConnectivityControl.getContainer().classList.add('internet-connectivity-control');

var alternativeInternetControl = new L.Control.LayersCustom(null, {
    "Non-Domestic WIFI": chinaWifiCableLayer,
    "Non-Domestic Mobile": foreignSimLayer,
    "Localized Satellite Internet": satelliteInternetLayer
}, { collapsed: false }).addTo(map);
alternativeInternetControl.getContainer().classList.add('alternative-internet-control');

var resistanceControl = new L.Control.LayersCustom(null, {
    "Resistance-controlled areas": eroControlledLayer
}, { collapsed: false }).addTo(map);
resistanceControl.getContainer().classList.add('resistance-control');

// Add the population density layer control using the default Leaflet control
var populationDensityControl = new L.Control.LayersCustom(null, {
    "Population Density (2020)": populationDensityLayer
}, { collapsed: false }).addTo(map);
populationDensityControl.getContainer().classList.add('additional-layers-control');
