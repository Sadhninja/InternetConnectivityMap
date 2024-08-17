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
  