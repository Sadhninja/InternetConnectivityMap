
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

// function style_ero_controlled(feature) {
//     if (feature.properties.ero === 'y') {
//         return {
//             color: "Red",
//             weight: 1,
//             fillOpacity: 0.01,
//         };
//     } else {
//         return {
//             opacity: 0,
//             fillOpacity: 0,
//         };
//     }
// }

////////////////
function style_ero_controlled(feature) {
    switch (feature.properties['2024_cs']) {
        case 'Full resistance control & local administration -- whole township':
            return {
                color: "Red",
                weight: 1,
                fillOpacity: 0.01,
            };
        case 'Junta control receding; resistance defending increasing territories & asserting local administration':
            return {
                color: "Red",
                weight: 1,
                fillOpacity: 0.01,
            };
        case 'Junta dependent on local proxy militias for control':
            return {
                color: "Red",
                weight: 1,
                fillOpacity: 0.01,
            };
        case 'Junta forces under regular attack from resistance forces; administration functions remain weak':
            return {
                color: "Red",
                weight: 1,
                fillOpacity: 0.01,
            };
        case 'Limited junta movement, dependent on ceasefires':
            return {
                color: "Red",
                weight: 1,
                fillOpacity: 0.01,
            };
        case 'Resistance controls growing territory but still cannot consolidate fuller control*':
            return {
                color: "Red",
                weight: 1,
                fillOpacity: 0.01,
            };
        case 'Stable junta control':
            return {
                color: "Red",
                weight: 1,
                fillOpacity: 0.01,
            };
        case 'Strong resistance control & local administration -- 90%+ of township':
            return {
                color: "Red",
                weight: 1,
                fillOpacity: 0.01,
            };
    }
}

////////////////////

function style_alternative(feature) {
    if (!feature.properties['reported c']) {
        return {
            fillColor: '#bb25d9',
            color: '#232323',
            weight: 1,
            fillOpacity: 0.5
        };
    }
    switch (feature.properties ['reported c']) {
        case 'Non-Domestic WIFI':
            return {
                //fillColor: 'url(#hashedPatternChinaWifi)',
                fillColor: '#6A3E98',
                color: '#1e8a15',
                weight: 2,
                fillOpacity: 0.9
            };
        case 'Non-Domestic Mobile':
            return {
                //fillColor: 'url(#hashedPatternForeignSim)',
                fillColor: '#8B1DFF',
                color: '#f0aa07',
                weight: 2,
                fillOpacity: 0.9
            };
        case 'Localized Satellite Internet':
            return {
                //fillColor: 'url(#hashedPatternSatellite)',
                fillColor: '#BA77FF',
                color: '#0d0dd4',
                weight: 2,
                fillOpacity: 0.9
            };
        default:
            return {
                fillColor: '#bb25d9',
                color: '#232323',
                weight: 1,
                fillOpacity: 0.9
            };
    }
}

function style_Internet_connectivity(feature) {
    switch (feature.properties['domestic n']) {
        case 'Active Areas':
            return {
                fillColor: "#0D7E3F",
                fillOpacity: 0.6,
                color: 'transparent'
            };
        case 'Unreported Areas':
            return {
                fillColor: "#EB7100",
                fillOpacity: 0.6,
                color: 'transparent'
            };
        case 'Internet Blackout Areas':
            return {
                fillColor: "#666666",
                fillOpacity: 0.6,
                color: 'transparent'
            };
        case 'Mobile & Internet Blackout Areas':
            return {
                fillColor: "#222222",
                fillOpacity: 0.6,
                color: 'transparent'
            };
        case 'Intermittent Service Areas':
            return {
                fillColor: "#FBC011",
                fillOpacity: 0.6,
                color: 'transparent'
            };
    }
}

// Function to bind pop-ups to features
function onEachFeature(feature, layer) {
    if (feature.properties) {
        var popupContent = 
            `<table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Internet Status:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties['domestic n'] || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>State & Region:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties['st'] || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>District:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties['dt'] || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Township:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties['ts'] || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;"><strong>Controlled:</strong></td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${feature.properties['2024_cs'] || 'N/A'}</td>
                </tr>
            </table>`;

        // Bind the pop-up to the layer
        layer.bindPopup(popupContent);

        // Bring the layer to the front when the pop-up is opened
        layer.on('popupopen', function () {
            layer.bringToFront();
        });
    }
}


// Create layer groups for each sub-category
var activatedAreaLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3ADomesticNetworkAvailability_v1&outputFormat=application%2Fjson", {
    style: function (feature) {
        //if (feature.properties.status === 'Activated Area') return style_Internet_connectivity(feature);
        if (feature.properties['domestic n'] === 'Active Areas') return style_Internet_connectivity(feature);

    },
    filter: function (feature) {
        return feature.properties ['domestic n'] === 'Active Areas';
    },
    onEachFeature: onEachFeature
});

var doNotKnowLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3ADomesticNetworkAvailability_v1&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties['domestic n'] === 'Unreported Areas') return style_Internet_connectivity(feature);
    },
    filter: function (feature) {
        return feature.properties ['domestic n'] === 'Unreported Areas';
    },
    onEachFeature: onEachFeature
});

var internetBlackoutLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3ADomesticNetworkAvailability_v1&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties ['domestic n'] === 'Internet Blackout Areas') return style_Internet_connectivity(feature);
    },
    filter: function (feature) {
        return feature.properties ['domestic n'] === 'Internet Blackout Areas';
    },
    onEachFeature: onEachFeature
});

var mobilePhoneAndInternetBlackoutLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3ADomesticNetworkAvailability_v1&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties ['domestic n'] === 'Mobile & Internet Blackout Areas') return style_Internet_connectivity(feature);
    },
    filter: function (feature) {
        return feature.properties ['domestic n'] === 'Mobile & Internet Blackout Areas';
    },
    onEachFeature: onEachFeature
});

var only2GAvailableLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3ADomesticNetworkAvailability_v1&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties['domestic n'] === 'Intermittent Service Areas') return style_Internet_connectivity(feature);
    },
    filter: function (feature) {
        return feature.properties ['domestic n'] === 'Intermittent Service Areas';
    },
    onEachFeature: onEachFeature
});

// Create layer groups for alternative internet categories
var chinaWifiCableLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3Areportedcasesofalternativenetwork&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties ['reported c'] === 'Non-Domestic WIFI') return style_alternative(feature);
    },
    filter: function (feature) {
        return feature.properties ['reported c'] === 'Non-Domestic WIFI';
    },
    onEachFeature: onEachFeature
});

var foreignSimLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3Areportedcasesofalternativenetwork&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties ['reported c'] === 'Non-Domestic Mobile') return style_alternative(feature);
    },
    filter: function (feature) {
        return feature.properties ['reported c'] === 'Non-Domestic Mobile';
    },
    onEachFeature: onEachFeature
});

var satelliteInternetLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3Areportedcasesofalternativenetwork&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties ['reported c'] === 'Localized Satellite Internet') return style_alternative(feature);
    },
    filter: function (feature) {
        return feature.properties ['reported c'] === 'Localized Satellite Internet';
    },
    onEachFeature: onEachFeature
});


// Create a new layer group for the population density overlay
var populationDensityLayer = L.layerGroup([populationDensityOverlay]);

// Create layer groups for resistance control area

// var eroControlledLayer = new L.GeoJSON.AJAX("geojson/ero_controlled.geojson", {
//     style: style_ero_controlled,
//     onEachFeature: onEachFeature
// });

var fullResistanceControlLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3Acontrolled&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties['2024_cs'] === 'Full resistance control & local administration -- whole township') return style_ero_controlled(feature);
    },
    filter: function (feature) {
        return feature.properties['2024_cs'] === 'Full resistance control & local administration -- whole township';
    },
    onEachFeature: onEachFeature
});

var juntaRecedingLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3Acontrolled&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties['2024_cs'] === 'Junta control receding; resistance defending increasing territories & asserting local administration') return style_ero_controlled(feature);
    },
    filter: function (feature) {
        return feature.properties['2024_cs'] === 'Junta control receding; resistance defending increasing territories & asserting local administration';
    },
    onEachFeature: onEachFeature
});

var juntaProxyMilitiaLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3Acontrolled&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties['2024_cs'] === 'Junta dependent on local proxy militias for control') return style_ero_controlled(feature);
    },
    filter: function (feature) {
        return feature.properties['2024_cs'] === 'Junta dependent on local proxy militias for control';
    },
    onEachFeature: onEachFeature
});

var juntaUnderAttackLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3Acontrolled&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties['2024_cs'] === 'Junta forces under regular attack from resistance forces; administration functions remain weak') return style_ero_controlled(feature);
    },
    filter: function (feature) {
        return feature.properties['2024_cs'] === 'Junta forces under regular attack from resistance forces; administration functions remain weak';
    },
    onEachFeature: onEachFeature
});

var limitedJuntaMovementLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3Acontrolled&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties['2024_cs'] === 'Limited junta movement, dependent on ceasefires') return style_ero_controlled(feature);
    },
    filter: function (feature) {
        return feature.properties['2024_cs'] === 'Limited junta movement, dependent on ceasefires';
    },
    onEachFeature: onEachFeature
});

var growingResistanceTerritoryLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3Acontrolled&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties['2024_cs'] === 'Resistance controls growing territory but still cannot consolidate fuller control*') return style_ero_controlled(feature);
    },
    filter: function (feature) {
        return feature.properties['2024_cs'] === 'Resistance controls growing territory but still cannot consolidate fuller control*';
    },
    onEachFeature: onEachFeature
});

var stableJuntaControlLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3Acontrolled&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties['2024_cs'] === 'Stable junta control') return style_ero_controlled(feature);
    },
    filter: function (feature) {
        return feature.properties['2024_cs'] === 'Stable junta control';
    },
    onEachFeature: onEachFeature
});

var strongResistanceControlLayer = new L.GeoJSON.AJAX("https://ircwebmap.webgis1.com/geoserver/InternetStatus/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=InternetStatus%3Acontrolled&outputFormat=application%2Fjson", {
    style: function (feature) {
        if (feature.properties['2024_cs'] === 'Strong resistance control & local administration -- 90%+ of township') return style_ero_controlled(feature);
    },
    filter: function (feature) {
        return feature.properties['2024_cs'] === 'Strong resistance control & local administration -- 90%+ of township';
    },
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
        
        legend.style.backgroundColor = 'transparent'; // Default color
        legend.style.transition = 'background-color 0.3s'; // Smooth color transition

        // Apply styles based on layer type
        switch (obj.name) {
            case 'Active Areas':
                legend.style.backgroundColor = '#0D7E3F';
                break;
            case 'Unreported Areas':
                legend.style.backgroundColor = '#EB7100 ';
                break;
            case 'Internet Blackout Areas':
                legend.style.backgroundColor = '#666666';
                break;
            case 'Mobile & Internet Blackout Areas':
                legend.style.backgroundColor = '#222222';
                break;
            case 'Intermittent Service Areas':
                legend.style.backgroundColor = '#FBC011';
                break;
            case 'Non-Domestic WIFI':
                legend.style.backgroundColor = '#6A3E98';
                legend.style.border = '2px solid 1e8a15';
                //legend.style.backgroundImage = 'url(#hashedPatternChinaWifi)';
                break;
            case 'Non-Domestic Mobile':
                legend.style.backgroundColor = '#8B1DFF';
                //legend.style.backgroundImage = 'url(#hashedPatternForeignSim)';
                break;
            case 'Localized Satellite Internet':
                legend.style.backgroundColor = '#BA77FF';
                //legend.style.backgroundImage = 'url(#hashedPatternSatellite)';
                break;
            case 'Population Density (2020)':
                legend.style.backgroundColor = '#784ca4';
                //legend.style.backgroundImage = 'url(#hashedPatternSatellite)';
                break;
            default:
                legend.style.backgroundColor = 'transparent';
                legend.style.border = '1px solid #e30e0e'; // Optional border
                

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
    "Internet Blackout Areas": internetBlackoutLayer,
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

// var resistanceControl = new L.Control.LayersCustom(null, {
//     "Resistance-controlled areas": eroControlledLayer
// }, { collapsed: false }).addTo(map);
// resistanceControl.getContainer().classList.add('resistance-control');

var resistanceControl = new L.Control.LayersCustom(null, {
    "Full resistance control & local administration": fullResistanceControlLayer,
    "Junta control receding; resistance defending": juntaRecedingLayer,
    "Junta dependent on local proxy militias": juntaProxyMilitiaLayer,
    "Junta forces under regular attack from resistance forces": juntaUnderAttackLayer,
    "Limited junta movement": limitedJuntaMovementLayer,
    "Resistance controls growing territory": growingResistanceTerritoryLayer,
    "Stable junta control": stableJuntaControlLayer,
    "Strong resistance control & local administration": strongResistanceControlLayer
}, { collapsed: false }).addTo(map);
resistanceControl.getContainer().classList.add('resistance-control');

// Add the population density layer control using the default Leaflet control
var populationDensityControl = new L.Control.LayersCustom(null, {
    "Population Density (2020)": populationDensityLayer
}, { collapsed: false,position: 'topleft' }).addTo(map);
populationDensityControl.getContainer().classList.add('additional-layers-control');
