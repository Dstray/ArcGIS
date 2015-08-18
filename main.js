/*!
 * ArcGIS v0.1.0 (http://dstray.github.io/ArcGIS)
 * Copyright 2015- Dstray
 * Licensed under the MIT license
 */

var map;
require([
    "esri/map",
    "esri/arcgis/utils",
    "esri/dijit/Legend",
    "dojo/domReady!"
    ], function(Map, arcgisUtils, Legend) {
        /*map = new Map("mapDiv", {
            center: [-56.049, 38.485],
            zoom: 3,
            basemap: "streets"
        });*/
        arcgisUtils.createMap("a71ceaa208ff4fb39b8f9abc5b717dc0", "mapDiv").then(function (response) {
            map = response.map;

            var legend = new Legend({
                map: map,
                layerInfos:(arcgisUtils.getLegendLayers(response))
            }, "legendDiv");
            legend.startup();
        });
});