"use strict";

var myFunctionHolder = {};

//declaring function 1
myFunctionHolder.addPopups = function (feature, layer) {
    if (feature.properties /*&& feature.properties.age*/) {
        layer.bindPopup(
            "<dl><dt>Location: </dt>" + feature.properties['trafid1']
            + "<dt>Number Killed: </dt>" + feature.properties['numfatal']
            + "<dt>Age: </dt>" + feature.properties['age']
            + "<dt>Coordinates </dt>" + feature.geometry['coordinates']
            + "<dt>Year: </dt>" + feature.properties['caseyear']
        );
    }
}

//declaring function 2
myFunctionHolder.pointToCircle = function (feature, latlng) {
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "greenyellow",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: .8
    };
    var circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
    return circleMarker;
}

//execute only when window is fully loaded
window.onload = function () {
    var mapObject = L.map('mapDivId').setView([39.961, -82.998], 11);

    var baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/sinba/ciperkjzk001jb6mdcb41o922/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2luYmEiLCJhIjoiY2loMWF6czQxMHdwcnZvbTNvMjVhaWV0MyJ9.zu-djzdfyr3C_Uj2F7noqg', {
        maxZoom: 18,
        attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
    }).addTo(mapObject);

    // fatalities is the variable name we defined in point data file. 

    var fatalsLayerGroup = L.geoJSON(fatalities, {
        onEachFeature: myFunctionHolder.addPopups,
        pointToLayer: myFunctionHolder.pointToCircle
    });

    mapObject.addLayer(fatalsLayerGroup);
    mapObject.fitBounds(fatalsLayerGroup.getBounds());

    var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        // if scaleRadius is false it will be the constant radius used in pixels
        "radius": 0.015,
        "maxOpacity": .8,
        // scales the radius based on map zoom
        "scaleRadius": true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries 
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": true,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'value'
    };

    var heatmapLayer = new HeatmapOverlay(cfg);
    var heatmapLayerGroup = L.geoJSON().addLayer(heatmapLayer);

    var button = document.getElementById("heatmapToggle");

    button.onclick = function() {
        heatmapLayer.setData(fatalitiesHeatmapData);
        heatmapLayerGroup = L.geoJSON().addLayer(heatmapLayer);
        mapObject.addLayer(heatmapLayer);
    }


    // if (document.getElementById("heatmapToggle").getAttribute("state") == 0) {
    //     print()
    //     mapObject.removeLayer(heatmapLayerGroup);
    // }
    // else {
    //     heatmapLayer.setData(fatalitiesHeatmapData);
    //     heatmapLayerGroup = L.geoJSON().addLayer(heatmapLayer);
    //     mapObject.addLayer(heatmapLayer);
    // }

    // var heatmapLayer = new HeatmapOverlay(cfg);
    // heatmapLayer.setData(fatalitiesHeatmapData);
    // mapObject.addLayer(heatmapLayer);
};