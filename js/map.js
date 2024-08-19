
// Initialize the map
var map = L.map('map').setView([21.9162, 95.9560], 7);

// Add a tile layer
var tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
    maxZoom: 13
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
                fillColor: 'url(#hashedPatternChinaWifi)',
                color: '#1e8a15',
                weight: 2,
                fillOpacity: 0.5
            };
        case 'Foreign SIM':
            return {
                fillColor: 'url(#hashedPatternForeignSim)',
                color: '#f0aa07',
                weight: 2,
                fillOpacity: 0.5
            };
        case 'Satellite Internet':
            return {
                fillColor: 'url(#hashedPatternSatellite)',
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
                fillColor: "#33a02c",
                fillOpacity: 0.5,
                color: 'transparent'
            };
        case 'Do Not Know':
            return {
                fillColor: "#8a7b89",
                fillOpacity: 0.5,
                color: 'transparent'
            };
        case 'Internet Blackout':
            return {
                fillColor: "#735859",
                fillOpacity: 0.5,
                color: 'transparent'
            };
        case 'Mobile Phone & Internet Blackout':
            return {
                fillColor: "#000000",
                fillOpacity: 0.5,
                color: 'transparent'
            };
        case 'Only 2G Available':
            return {
                fillColor: "#3c5c66",
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
            input,
            checked = this._map.hasLayer(obj.layer),
            container;

        if (obj.overlay) {
            input = document.createElement('input');
            input.type = 'checkbox';
            input.className = 'leaflet-control-layers-selector';
            input.defaultChecked = checked;
            if (obj.name === 'Resistance Control Area') {
                input.checked = false; // Ensure this layer is unchecked by default
            }
        } else {
            input = this._createRadioElement('leaflet-base-layers', checked);
        }

        this._layerControlInputs.push(input);
        input.layerId = L.stamp(obj.layer);

        L.DomEvent.on(input, 'click', this._onInputClick, this);

        var name = document.createElement('span');
        name.innerHTML = ' ' + obj.name;

        // Create the legend square
        var legend = document.createElement('span');
        legend.style.display = 'inline-block';
        legend.style.width = '12px';
        legend.style.height = '12px';
        legend.style.marginRight = '8px';

        // Apply styles based on layer type
        switch (obj.name) {
            case 'Activated Area':
                legend.style.backgroundColor = '#33a02c';
                break;
            case 'Do Not Know':
                legend.style.backgroundColor = '#8a7b89';
                break;
            case 'Internet Blackout':
                legend.style.backgroundColor = '#735859';
                break;
            case 'Mobile Phone & Internet Blackout':
                legend.style.backgroundColor = '#000000';
                break;
            case 'Only 2G Available':
                legend.style.backgroundColor = '#3c5c66';
                break;
            case 'Resistance Control Area':
                legend.style.border = '2px solid red';
                legend.style.backgroundColor = 'transparent';
                break;
            case 'China wifi cable':
                legend.style.backgroundImage = 'url(#hashedPatternChinaWifi)';
                break;
            case 'Foreign SIM':
                legend.style.backgroundImage = 'url(#hashedPatternForeignSim)';
                break;
            case 'Satellite Internet':
                legend.style.backgroundImage = 'url(#hashedPatternSatellite)';
                break;
            default:
                legend.style.backgroundColor = 'transparent';
        }

        label.appendChild(input);
        label.appendChild(legend);
        label.appendChild(name);

        var container = obj.overlay ? this._overlaysList : this._baseLayersList;
        container.appendChild(label);

        return label;
    }
});

// Initialize custom layer controls
var resistanceControl = new L.Control.LayersCustom(null, {
    "Resistance Control Area": eroControlledLayer
}, { collapsed: false }).addTo(map);
resistanceControl.getContainer().classList.add('resistance-control');

var internetConnectivityControl = new L.Control.LayersCustom(null, {
    "Activated Area": activatedAreaLayer,
    "Do Not Know": doNotKnowLayer,
    "Internet Blackout": internetBlackoutLayer,
    "Mobile Phone & Internet Blackout": mobilePhoneAndInternetBlackoutLayer,
    "Only 2G Available": only2GAvailableLayer
}, { collapsed: false }).addTo(map);
internetConnectivityControl.getContainer().classList.add('internet-connectivity-control');

var alternativeInternetControl = new L.Control.LayersCustom(null, {
    "China wifi cable": chinaWifiCableLayer,
    "Foreign SIM": foreignSimLayer,
    "Satellite Internet": satelliteInternetLayer
}, { collapsed: false }).addTo(map);
alternativeInternetControl.getContainer().classList.add('alternative-internet-control');

// Add the population density layer control using the default Leaflet control
var populationDensityControl = new L.Control.LayersCustom(null, {
    "Population Density (2020)": populationDensityLayer
}, { collapsed: false }).addTo(map);
populationDensityControl.getContainer().classList.add('additional-layers-control');