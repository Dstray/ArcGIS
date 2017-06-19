/*!
 * ArcGIS v0.1.0 (http://dstray.github.io/ArcGIS)
 * Copyright 2015- Dstray
 * Licensed under the MIT license
 */

require([
    "esri/Map",
    //"esri/dijit/Directions",
    "esri/views/MapView",
    /*API for layout*/
    //"dojo/parser",
    //"dijit/layout/BorderContainer", "dijit/layout/ContentPane",
    /*API for remote map*/
    //"esri/arcgis/utils",
    //"esri/dijit/Legend",
    "esri/layers/FeatureLayer",
    "dojo/domReady!"
    ], function(Map, MapView, FeatureLayer) {
    //parser.parse();
    var map = new Map("map", {
        center: [-56.049, 38.485],
        zoom: 4,
        basemap: "topo-vector"
    });/*
    arcgisUtils.createMap("1a40fa5cc1ab4569b79f45444d728067", "mapDiv").then(function (response) {
        map = response.map;

        var legend = new Legend({
            map: map,
            layerInfos:(arcgisUtils.getLegendLayers(response))
        }, "legendDiv");
        legend.startup();
    });*//*
    var directions = new Directions({
        map: map,
        routeTaskUrl: "http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route"
    }, "dir");
    directions.startup();*/
    var featureLayer = new FeatureLayer({
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer"
    });

    map.add(featureLayer);
    var view = new MapView({
        container: "map",
        map: map
    });
});