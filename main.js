"use strict";

//execute only when window is fully loaded
window.onload = function () {
    var myFunctionHolder = {};
    
    //declaring popups function
    myFunctionHolder.addPopups = function (feature, layer) {
        var survived = '';
        if (feature.properties['dthday'] == -1 || feature.properties['dthday'] == 88 || feature.properties['dthday'] == 99){
            survived = 'Lived';
        } 
        else {
            survived = 'Deceased';
        }
    
        var years = '';
        if (feature.properties['age'] == 999){
            years = 'Unknown';
        }
        else {
            years = feature.properties['age'];
        }
    
        var gender = '';
        switch(feature.properties.sex){
            case 1:
                gender = 'Male';
                break;
            case 2:
                gender = 'Female';
                break;
            default:
                gender = 'Unknown';
        }

        var race = '';
        switch(feature.properties.race){
            case -1:
                race = 'N/A';
                break;
            case 0:
                race = 'N/A';
                break;
            case 1:
                if (feature.properties.hispanic >= 1 && feature.properties.hispanic <= 6){
                    race = 'Hispanic';
                }
                else {
                    race = 'White';
                }
                break;
            case 2:
                race = 'Black';
                break;
            case 18:
                race = 'Asian Indian';
                break;
            case 19:
                race = 'Other Indian';
                break;
            case 68:
                race = 'Other Asian';
                break;
            case 98:
                race = 'Other';
                break;
            case 99:
                race = 'Unknown';
                break;
        }
    
        if (feature.properties) {
            layer.bindPopup(
                "<dl><dt>Date of accident: </dt>" + feature.properties.accmon + " / " + feature.properties.accday + " / " + feature.properties.caseyear
                + "<dt>Location: </dt>" + feature.properties.trafid1
                + "<dt>Number Killed: </dt>" + feature.properties.numfatal
                + "<dt>Age: </dt>" + years
                + "<dt>Sex: </dt>" + gender
                + "<dt>Race: </dt>" + race
                + "<dt>Status: </dt>" + survived
            );
            //document.getElementById("info_loc").innerHTML = "Location: " + feature.properties.trafid1;
        }
    }
    
    //declaring point function
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

    var mapObject = L.map('mapDivId').setView([39.961, -82.998], 11);

    var baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/sinba/ciperkjzk001jb6mdcb41o922/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2luYmEiLCJhIjoiY2loMWF6czQxMHdwcnZvbTNvMjVhaWV0MyJ9.zu-djzdfyr3C_Uj2F7noqg', {
        maxZoom: 18,
        attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy;"
    }).addTo(mapObject);

    var satToggle = document.getElementById("satToggle");
    satToggle.onclick = function() {
        if(!document.getElementById("unchecked3").checked){ // set map to satellite when toggle is on
            if (mapObject.hasLayer(baseMap)){
                mapObject.removeLayer(baseMap);
            }
            // sat map
            baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/wwortkoetter/cj9rq59ip1bv72smp6cqi0ymq/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid3dvcnRrb2V0dGVyIiwiYSI6ImNqNnpnbDJkbDAwNWsycm15ZzI2dW1rc2cifQ.z6g-MJ7zdh699j4x_4U80Q', {
                maxZoom: 18,
                attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy;"
            }).addTo(mapObject);
            document.getElementById("unchecked3").checked = true;
            
        }
        else { // set map to dark theme when toggle is off
            if (mapObject.hasLayer(baseMap)){
                mapObject.removeLayer(baseMap);
            }            
            // dark map
            baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/sinba/ciperkjzk001jb6mdcb41o922/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2luYmEiLCJhIjoiY2loMWF6czQxMHdwcnZvbTNvMjVhaWV0MyJ9.zu-djzdfyr3C_Uj2F7noqg', {
                maxZoom: 18,
                attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy;"
            }).addTo(mapObject);
            document.getElementById("unchecked3").checked = false;
        }
    }

    // fatality points
    var fatalsLayerGroup = L.geoJSON(fatalities, {
        onEachFeature: myFunctionHolder.addPopups,
        pointToLayer: myFunctionHolder.pointToCircle
    });

    fatalsLayerGroup.onclick = function(){
        document.getElementById("info_loc").innerHTML = "Location: " + feature.properties['trafid1'];
    }

    mapObject.addLayer(fatalsLayerGroup);
    mapObject.fitBounds(fatalsLayerGroup.getBounds());

    // clusters
    var clusters = L.markerClusterGroup();
    clusters.addLayer(fatalsLayerGroup);

    // button to toggle clusters
    var clustertoggle = document.getElementById("clusterToggle");
    clustertoggle.onclick = function() {
        if (!document.getElementById("unchecked2").checked){
            mapObject.addLayer(clusters);
            document.getElementById("unchecked2").checked = true;
        }
        else {
            mapObject.removeLayer(clusters);
            mapObject.removeLayer(fatalsLayerGroup);
            mapObject.addLayer(fatalsLayerGroup);
            document.getElementById("unchecked2").checked = false;
        }
    }

    // heatmap

    // heatmap config
    var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        // if scaleRadius is false it will be the constant radius used in pixels
        "radius": .015,
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
    heatmapLayer.setData(fatalitiesHeatmapData);

    // button to toggle heatmap
    var heattoggle = document.getElementById("heatmapToggle");
    heattoggle.onclick = function() {
        if (!document.getElementById("unchecked1").checked){
            mapObject.addLayer(heatmapLayer);
            document.getElementById("unchecked1").checked = true;
        }
        else {
            mapObject.removeLayer(heatmapLayer);
            document.getElementById("unchecked1").checked = false;
        }
    }

    
};