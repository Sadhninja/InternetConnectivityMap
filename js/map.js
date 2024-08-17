// Initialize the map
var map = L.map('map').setView([21.9162, 95.9560], 7); // Change the coordinates and zoom level as needed

// Add a tile layer
// var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   maxZoom: 18,
// }).addTo(map);

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
      color: "black",
      weight: 1,
      fillOpacity: 0.01, // Ensure interactivity
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
      fillColor: '#bb25d9', // Default fill color
      color: '#232323', // Default border color
      weight: 1,
      fillOpacity: 0.5
    };
  }
  switch (feature.properties.Alternativ) {
    case 'China wifi cable':
      return {
        fillColor: 'url(#hashedPatternChinaWifi)', // Use the pattern defined
        color: '#33a02c',
        weight: 2,
        fillOpacity: 0.5
      };
    case 'Foreign SIM':
      return {
        fillColor: 'url(#hashedPatternForeignSim)', // Use the pattern defined
        color: '#a67db8',
        weight: 2,
        fillOpacity: 0.5
      };
    case 'Satellite Internet':
      return {
        fillColor: 'url(#hashedPatternSatellite)', // Use the pattern defined
        color: '#e31a1c',
        weight: 2,
        fillOpacity: 0.5
      };
    default:
      return {
        fillColor: '#bb25d9', // Default fill color
        color: '#232323', // Default border color
        weight: 1,
        fillOpacity: 0.5
      };
  }
}

function style_Internet_connectivity(feature) {
  switch (feature.properties.status) {
    case 'Activated Area':
      return {
        fillColor: "#f9f3f3",
        fillOpacity: 0.7,
        color: 'transparent'
      };
    case 'Do Not Know':
      return {
        fillColor: "#edb183",
        fillOpacity: 0.7,
        color: 'transparent'
      };
    case 'Internet Blackout':
      return {
        fillColor: "#7ea8be",
        fillOpacity: 0.7,
        color: 'transparent'
      };
    case 'Mobile Phone & Internet Blackout':
      return {
        fillColor: "#f4d8cd",
        fillOpacity: 0.7,
        color: 'transparent'
      };
    case 'Only 2G Available':
      return {
        fillColor: "#525252",
        fillOpacity: 0.7,
        color: 'transparent'
      };
  }
}

// Function to bind pop-ups to features
function onEachFeature(feature, layer) {
  if (feature.properties) {
    var popupContent = '<strong>Status:</strong> ' + (feature.properties.status || 'N/A') + '<br>' +
                       '<strong>TS:</strong> ' + (feature.properties.TS || 'N/A');
    layer.bindPopup(popupContent);
  }
}

// Create layer groups for each sub-category
var activatedAreaLayer = new L.GeoJSON.AJAX("geojson/internet_connectivity.geojson", {
  style: function(feature) {
    if (feature.properties.status === 'Activated Area') return style_Internet_connectivity(feature);
  },
  filter: function(feature) {
    return feature.properties.status === 'Activated Area';
  },
  onEachFeature: onEachFeature
});

var doNotKnowLayer = new L.GeoJSON.AJAX("geojson/internet_connectivity.geojson", {
  style: function(feature) {
    if (feature.properties.status === 'Do Not Know') return style_Internet_connectivity(feature);
  },
  filter: function(feature) {
    return feature.properties.status === 'Do Not Know';
  },
  onEachFeature: onEachFeature
});

var internetBlackoutLayer = new L.GeoJSON.AJAX("geojson/internet_connectivity.geojson", {
  style: function(feature) {
    if (feature.properties.status === 'Internet Blackout') return style_Internet_connectivity(feature);
  },
  filter: function(feature) {
    return feature.properties.status === 'Internet Blackout';
  },
  onEachFeature: onEachFeature
});

var mobilePhoneAndInternetBlackoutLayer = new L.GeoJSON.AJAX("geojson/internet_connectivity.geojson", {
  style: function(feature) {
    if (feature.properties.status === 'Mobile Phone & Internet Blackout') return style_Internet_connectivity(feature);
  },
  filter: function(feature) {
    return feature.properties.status === 'Mobile Phone & Internet Blackout';
  },
  onEachFeature: onEachFeature
});

var only2GAvailableLayer = new L.GeoJSON.AJAX("geojson/internet_connectivity.geojson", {
  style: function(feature) {
    if (feature.properties.status === 'Only 2G Available') return style_Internet_connectivity(feature);
  },
  filter: function(feature) {
    return feature.properties.status === 'Only 2G Available';
  },
  onEachFeature: onEachFeature
});

// Create layer groups for alternative internet categories
var chinaWifiCableLayer = new L.GeoJSON.AJAX("geojson/alternative_1.geojson", {
  style: function(feature) {
    if (feature.properties.Alternativ === 'China wifi cable') return style_alternative(feature);
  },
  filter: function(feature) {
    return feature.properties.Alternativ === 'China wifi cable';
  }
});

var foreignSimLayer = new L.GeoJSON.AJAX("geojson/alternative_1.geojson", {
  style: function(feature) {
    if (feature.properties.Alternativ === 'Foreign SIM') return style_alternative(feature);
  },
  filter: function(feature) {
    return feature.properties.Alternativ === 'Foreign SIM';
  }
});

var satelliteInternetLayer = new L.GeoJSON.AJAX("geojson/alternative_1.geojson", {
  style: function(feature) {
    if (feature.properties.Alternativ === 'Satellite Internet') return style_alternative(feature);
  },
  filter: function(feature) {
    return feature.properties.Alternativ === 'Satellite Internet';
  }
});

// Create layer groups for resistance control area
var eroControlledLayer = new L.GeoJSON.AJAX("geojson/ero_controlled.geojson", {
  style: style_ero_controlled,
  onEachFeature: onEachFeature // Ensure popups are bound
});

// Add layers to the map
activatedAreaLayer.addTo(map);
doNotKnowLayer.addTo(map);
internetBlackoutLayer.addTo(map);
mobilePhoneAndInternetBlackoutLayer.addTo(map);
only2GAvailableLayer.addTo(map);
eroControlledLayer.addTo(map);
chinaWifiCableLayer.addTo(map);
foreignSimLayer.addTo(map);
satelliteInternetLayer.addTo(map);

// Create a control for the Resistance Control Area
var resistanceControlLayers = {
  "Resistance Control Area": eroControlledLayer,
};

L.control.layers(null, resistanceControlLayers, { collapsed: false }).addTo(map);

// Create a control for the Internet Connectivity sub-categories
var internetConnectivityLayers = {
  "Activated Area": activatedAreaLayer,
  "Do Not Know": doNotKnowLayer,
  "Internet Blackout": internetBlackoutLayer,
  "Mobile Phone & Internet Blackout": mobilePhoneAndInternetBlackoutLayer,
  "Only 2G Available": only2GAvailableLayer
};

var internetConnectivityControl = L.control.layers(null, internetConnectivityLayers, { collapsed: false }).addTo(map);
internetConnectivityControl.getContainer().prepend("Internet Connectivity");

// Create a control for the Alternative Internet sub-categories
var alternativeInternetLayers = {
  "China wifi cable": chinaWifiCableLayer,
  "Foreign SIM": foreignSimLayer,
  "Satellite Internet": satelliteInternetLayer
};

var alternativeInternetControl = L.control.layers(null, alternativeInternetLayers, { collapsed: false }).addTo(map);
alternativeInternetControl.getContainer().prepend("Alternative Internet");
