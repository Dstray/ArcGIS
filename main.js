/*!
 * ArcGIS v0.1.0 (http://dstray.github.io/ArcGIS)
 * Copyright 2015- Dstray
 * Licensed under the MIT license
 */

var map;
require([
    "esri/map",
    "esri/dijit/Directions",
    //API  for layout
    "dojo/parser", 
    "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
    //"esri/arcgis/utils",
    //"esri/dijit/Legend",
    "dojo/domReady!"
    ], function(Map, Directions, parser) {
    parser.parse();
    map = new Map("map", {
        center: [-56.049, 38.485],
        zoom: 3,
        basemap: "streets"
    });/*
    arcgisUtils.createMap("1a40fa5cc1ab4569b79f45444d728067", "mapDiv").then(function (response) {
        map = response.map;

        var legend = new Legend({
            map: map,
            layerInfos:(arcgisUtils.getLegendLayers(response))
        }, "legendDiv");
        legend.startup();
    });*/
    var directions = new Directions({
        map: map
    }, "dir");
    directions.startup();
});