// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  


  createFeatures(data);
});

function createFeatures(earthquakeData) {

  function makeradius(mag) {
    if (mag === 0) {
      return 1;
    }
    return mag * 5;
  }
  
  function makecolor(depth) {
    if (depth > 20) {
      return "#ea2c2c";
    }
    if (depth > 15) {
      return "#ea822c";
    }
    if (depth > 10) {
      return "#ee9c00";
    }
    if (depth > 5) {
      return "#eecc00";
    }
    if (depth > 1) {
      return "#d4ee00";
    }
    return "#98ee00";
  }

    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: makecolor(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: makeradius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJson(earthquakeData, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
        console.log(earthquakeData);
        return L.circleMarker(latlng);
      },
    // We set the style for each circleMarker using our styleInfo function.
  style: styleInfo,

   // We create a popup for each circleMarker to display the magnitude and location of the earthquake
   //  after the marker has been created and styled.
   onEachFeature: function(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }
})


  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}

var legend = L.control({position: 'bottomright'});


legend.addTo(myMap);

