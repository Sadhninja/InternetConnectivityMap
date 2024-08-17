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
  