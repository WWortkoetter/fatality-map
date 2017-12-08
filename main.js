"use strict";

var weatherdict = {
    "-1": "Blank",
    "0": "No Additional Atmospheric Conditions",
    "1": "Clear",
    "2": "Rain",
    "3": "Sleet or Hail",
    "4": "Snow",
    "5": "Fog, Smog, Smoke",
    "6": "Severe Crosswinds",
    "7": "Blowing Sand, Soil, Dirt",
    "8": "Other",
    "10": "Cloudy",
    "11": "Blowing Snow",
    "12": "Freezing Rain or Drizzle",
    "98": "Not Reported",
    "99": "Unknown"
}

var racedict = {
    "-1": "Blank",
    "0": "Not a fatality (N/A)",
    "1": "White",
    "2": "Black",
    "3": "American Indian",
    "4": "Chinese",
    "5": "Japanese",
    "6": "Hawaiian",
    "7": "Filipino",
    "18": "Asian Indian",
    "19": "Other Indian",
    "28": "Korean",
    "38": "Samoan",
    "48": "Vietnamese",
    "58": "Guamanian",
    "68": "Other Asian or Pacific Islander",
    "78": "Asian or Pacific Islander",
    "97": "Multiple Races",
    "98": "All other races",
    "99": "Unknown"
}

var genderdict = {
    "-1": "Blank",
    "1": "Male",
    "2": "Female",
    "8": "Not Reported",
    "9": "Unknown"
}

var yeardict = {
    "all": heatall,
    "2016": heat2016,
    "2015": heat2015,
    "2014": heat2014,
    "2013": heat2013,
    "2012": heat2012,
    "2011": heat2011,
    "2010": heat2010,
    "2009": heat2009,
    "2008": heat2008,
    "2007": heat2007,
    "2006": heat2006
}

var lightdict = {
    "-1": "Blank",
    "1": "Daylight",
    "2": "Dark - Not Lighted",
    "3": "Dark - Lighted",
    "4": "Dawn",
    "5": "Dusk",
    "6": "Dark - Unknown Lighting",
    "7": "Other",
    "8": "Not Reported",
    "9": "Unknown"
}

//execute only when window is fully loaded
window.onload = function () {

    document.getElementById("pure-toggle-right").checked = true;

    var infobutton = document.getElementById("infoButton");
    var desc1 = "Welcome to Crash Mapper.";
    var desc2 = "\n\nThis application is designed to better visualize vehicular deaths in the Columbus area\nin an effort to better understand the connecting factors between these instances.";
    var desc3 = "\n\nMake use of the many features of this application to better make correlations:\n - Hiding the points can be useful to declutter the map to better find points of interest.\n - Clustering can identify those points where 2 or more deaths occured.\n - The heatmap will paint the area with various colors to more easily highlight those areas with higher densities of fatalities.\n - The satellite toggle will change the map to a photographic view.";
    var credits = "\n\nCreated by Wyatt Wortkeotter and Evan Kraus\nGeography 5201 - Geovisualization\nProf. Morteza Karimzadeh\nThe Ohio State University";
    var infotext = desc1 + desc2 + desc3 + credits;
    infobutton.onclick = function() {
        alert(infotext);
    }

    function personalFilter(feature, layer) {
        var yr = document.getElementById("yearval").value;
        if (yr == "all") {
            return (feature.properties.dthyr != 8888 && feature.properties.dthyr != 0);
        }
        return (feature.properties.caseyear == yr && feature.properties.dthyr != 8888 && feature.properties.dthyr != 0);
    }

    var myFunctionHolder = {};

    //declaring popups function
    myFunctionHolder.addPopups = function (feature, layer) {
        var survived = '';
        if (feature.properties.dthday == -1 || feature.properties.dthday == 88 || feature.properties.dthday == 99) {
            survived = 'Lived';
        }
        else {
            survived = 'Deceased';
        }

        var years = '';
        if (feature.properties.age == 999) {
            years = 'Unknown';
        }
        else {
            years = feature.properties.age;
        }

        if (feature.properties) {
            layer.bindPopup(
                "<b>Date of accident: </b>" + feature.properties.accmon + "/" + feature.properties.accday + "/" + feature.properties.caseyear
                + "<br><b>Location: </b>" + feature.properties.trafid1
                + "<br><b>Number Killed: </b>" + feature.properties.numfatal
                + "<br><b>Age: </b>" + years
                + "<br><b>Sex: </b>" + genderdict[feature.properties.sex]
                + "<br><b>Race: </b>" + racedict[feature.properties.race]
                + "<br><b>Weather: </b>" + weatherdict[feature.properties.atmcond]
                + "<br><b>Lighting: </b>" + lightdict[feature.properties.lightcond]
            );
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
        circleMarker.on('click', function () {
            document.getElementById("info_casenum").innerHTML = "<b>Case Number: </b>" + feature.properties.casenum;
            document.getElementById("info_date").innerHTML = "<b>Date of Accident: </b>" + feature.properties.accmon + "/" + feature.properties.accday + "/" + feature.properties.caseyear;
            document.getElementById("info_loc").innerHTML = "<b>Location: </b>" + feature.properties.trafid1;
            if (feature.properties.caseyear >= 2009) {
                if (feature.properties.age == 998 || feature.properties.age == 999 || feature.properties.age == -1) {
                    document.getElementById("info_age").innerHTML = "<b>Age: </b>Unknown";
                }
                else {
                    document.getElementById("info_age").innerHTML = "<b>Age: </b>" + feature.properties.age;
                }
            }
            else {
                if (feature.properties.age > 97 || feature.properties.age == -1) {
                    document.getElementById("info_age").innerHTML = "<b>Age: </b>Unknown";
                }
                else {
                    document.getElementById("info_age").innerHTML = "<b>Age: </b>" + feature.properties.age;
                }
            }
            document.getElementById("info_numfatal").innerHTML = "<b>Number of Fatalities: </b>" + feature.properties.numfatal;
            document.getElementById("info_weather").innerHTML = "<b>Weather: </b>" + weatherdict[feature.properties.atmcond];
            document.getElementById("info_light").innerHTML = "<b>Lighting: </b>" + lightdict[feature.properties.lightcond];
            document.getElementById("info_sex").innerHTML = "<b>Sex: </b>" + genderdict[feature.properties.sex];
            document.getElementById("info_race").innerHTML = "<b>Race: </b>" + racedict[feature.properties.race];
            if (feature.properties.caseyear >= 2015) {
                if (feature.properties.alcres >= 995 || feature.properties.alcres == -1) {
                    document.getElementById("info_bac").innerHTML = "<b>BAC: </b>Unknown";
                }
                else if (feature.properties.alcres >= 100) {
                    document.getElementById("info_bac").innerHTML = "<b>BAC: </b>0." + feature.properties.alcres + "%";
                }
                else if (feature.properties.alcres >= 10) {
                    document.getElementById("info_bac").innerHTML = "<b>BAC: </b> 0.0" + feature.properties.alcres + "%";
                }
                else if (feature.properties.alcres >= 0) {
                    document.getElementById("info_bac").innerHTML = "<b>BAC: </b> 0.00" + feature.properties.alcres + "%";
                }
            }
            else {
                if (feature.properties.alcres >= 95 || feature.properties.alcres == -1) {
                    document.getElementById("info_bac").innerHTML = "<b>BAC: </b> Unknown";
                }
                else if (feature.properties.alcres >= 10) {
                    document.getElementById("info_bac").innerHTML = "<b>BAC: </b> 0." + feature.properties.alcres + "%";
                }
                else if (feature.properties.alcres >= 0) {
                    document.getElementById("info_bac").innerHTML = "<b>BAC: </b> 0.0" + feature.properties.alcres + "%";
                }
            }
        })
        return circleMarker;
    }

    var mapObject = L.map('mapDivId').setView([39.961, -82.89], 11);

    var baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/erkraus/cjahqt4zb97sk2spesjpgheb1/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXJrcmF1cyIsImEiOiJjajlxYm1hMDM2MG45MnFzNDU3dzgzcmVzIn0.xr26eepd9OU-2qebI9xWrw', {
        maxZoom: 18,
        attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; Data from <a href='https://www-fars.nhtsa.dot.gov//QueryTool/QuerySection/SelectYear.aspx'>FARS</a>"
    }).addTo(mapObject);

    var satToggle = document.getElementById("satToggle");
    satToggle.onclick = function () {
        if (!document.getElementById("unchecked4").checked) { // set map to satellite when toggle is on
            if (mapObject.hasLayer(baseMap)) {
                mapObject.removeLayer(baseMap);
            }
            // sat map
            baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/erkraus/cj9qdvp6o034n2sk6uc26w51p/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXJrcmF1cyIsImEiOiJjajlxYm1hMDM2MG45MnFzNDU3dzgzcmVzIn0.xr26eepd9OU-2qebI9xWrw', {
                maxZoom: 18,
                attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; Data from <a href='https://www-fars.nhtsa.dot.gov//QueryTool/QuerySection/SelectYear.aspx'>FARS</a>"
            }).addTo(mapObject);
            document.getElementById("unchecked4").checked = true;

        }
        else { // set map to dark theme when toggle is off
            if (mapObject.hasLayer(baseMap)) {
                mapObject.removeLayer(baseMap);
            }
            // dark map
            baseMap = L.tileLayer('https://api.mapbox.com/styles/v1/erkraus/cjahqt4zb97sk2spesjpgheb1/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXJrcmF1cyIsImEiOiJjajlxYm1hMDM2MG45MnFzNDU3dzgzcmVzIn0.xr26eepd9OU-2qebI9xWrw', {
                maxZoom: 18,
                attribution: "&copy; <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> &copy; Data from <a href='https://www-fars.nhtsa.dot.gov//QueryTool/QuerySection/SelectYear.aspx'>FARS</a>"
            }).addTo(mapObject);
            document.getElementById("unchecked4").checked = false;
        }
    }

    // fatality points
    var fatalsLayerGroup = L.geoJSON(fatalities, {
        onEachFeature: myFunctionHolder.addPopups,
        pointToLayer: myFunctionHolder.pointToCircle,
        filter: personalFilter
    });

    mapObject.addLayer(fatalsLayerGroup);

    // clusters
    var clusters = L.markerClusterGroup({
        filter: personalFilter
    });
    clusters.addLayer(fatalsLayerGroup);

    // heatmap

    // heatmap config
    var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        // if scaleRadius is false it will be the constant radius used in pixels
        "radius": .015,
        "maxOpacity": .5,
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
        valueField: 'numfatal',
    };

    var heatmapLayer = new HeatmapOverlay(cfg);

    heatmapLayer.setData(yeardict[document.getElementById("yearval").value]);

    //button to toggle points
    var pointtoggle = document.getElementById("pointToggle");
    pointtoggle.onclick = function () {
        if (!document.getElementById("unchecked1").checked) {
            mapObject.removeLayer(fatalsLayerGroup);
            mapObject.removeLayer(clusters);
            document.getElementById("unchecked3").checked = false;
            document.getElementById("unchecked1").checked = true;
        }
        else {
            mapObject.addLayer(fatalsLayerGroup);
            document.getElementById("unchecked1").checked = false;
        }
    };

    // button to toggle clusters
    var clustertoggle = document.getElementById("clusterToggle");
    clustertoggle.onclick = function () {
        if (!document.getElementById("unchecked3").checked && !document.getElementById("unchecked1").checked) {
            mapObject.addLayer(clusters);
            document.getElementById("unchecked3").checked = true;
        }
        else {
            mapObject.removeLayer(clusters);
            mapObject.removeLayer(fatalsLayerGroup);
            if (!document.getElementById("unchecked1").checked){
                mapObject.addLayer(fatalsLayerGroup);
            }
            document.getElementById("unchecked3").checked = false;
        }
    };

    // button to toggle heatmap
    var heattoggle = document.getElementById("heatmapToggle");
    heattoggle.onclick = function () {
        if (!document.getElementById("unchecked2").checked) {
            mapObject.addLayer(heatmapLayer);
            document.getElementById("unchecked2").checked = true;
        }
        else {
            mapObject.removeLayer(heatmapLayer);
            document.getElementById("unchecked2").checked = false;
        }
    };

    // year picker
    document.getElementById("yearval").onchange = function () {
        mapObject.removeLayer(fatalsLayerGroup);
        clusters.removeLayer(fatalsLayerGroup);
        heatmapLayer.setData(yeardict[document.getElementById("yearval").value]);
        fatalsLayerGroup = L.geoJSON(fatalities, {
            onEachFeature: myFunctionHolder.addPopups,
            pointToLayer: myFunctionHolder.pointToCircle,
            filter: personalFilter
        });
        mapObject.addLayer(fatalsLayerGroup);
        if (document.getElementById("unchecked1").checked){
            mapObject.removeLayer(fatalsLayerGroup);
        }
        clusters.addLayer(fatalsLayerGroup);
    }
};


