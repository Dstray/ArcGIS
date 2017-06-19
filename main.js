/*!
 * ArcGIS v0.1.0 (http://dstray.github.io/ArcGIS)
 * Copyright 2017- Dstray
 * Licensed under the MIT license
 */

require([
        "esri/Map",
        "esri/views/MapView",
        "esri/widgets/Search",
        "dojo/domReady!"
    ], function(Map, MapView, Search) {

    var map = new Map({
        basemap: "streets-navigation-vector"
    });

    var view = new MapView({
        container: "mapView",
        map: map,
        center: [-87.6298,41.8781],
        zoom: 9
    });

    // Search widget
    var search = new Search({
        view: view
    });
    //search.defaultSource.withinViewEnabled = true; // Limit search to visible map area only
    view.ui.add(search, "top-right"); // Add to the view
});