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
  
  // Create layer group for resistance control area
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
  