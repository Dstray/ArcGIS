/*!
 * ArcGIS v0.1.0 (http://dstray.github.io/ArcGIS)
 * Copyright 2017- Dstray
 * Licensed under the MIT license
 */

require([
        "esri/Map",
        "esri/tasks/Locator",
        "esri/views/MapView",
        "esri/widgets/BasemapToggle",
        "esri/widgets/Locate",
        "esri/widgets/Search",
        "dojo/domReady!"
    ], function(Map, Locator, MapView, BasemapToggle, Locate, Search) {

    var map = new Map({
        basemap: "streets-relief-vector"
    });

    var view = new MapView({
        container: "mapView",
        map: map,
        center: [-87.6298, 41.8781], // Chicago
        zoom: 9
    });

    // ------------- Locator task ---------------
    var locator = new Locator({
        url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    });
    view.on("click", function(event){
        view.popup.clear();

        var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
        var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
        view.popup.open({
            // Set the popup's title to the coordinates of the clicked location
            title: "Reverse geocode: [" + lon + ", " + lat + "]",
            location: event.mapPoint // Set the location of the popup to the clicked location
        });

        locator.locationToAddress(event.mapPoint).then(function(response){
            view.popup.content = response.address.Match_addr;
        }, function(error){
            console.log(error);
        });
    });

    // ------------- Search widget ---------------
    var search = new Search({
        view: view
    });
    //search.defaultSource.withinViewEnabled = true; // Limit search to visible map area only
    view.ui.add(search, "top-right"); // Add to the view

    // ------------- Locate widget ---------------
    var locate = new Locate({
        view: view
    });
    locate.goToLocationEnabled = false;
    locate.on("locate", function(geoloc){
        var coords = geoloc.position.coords
        //console.log(coords);
        view.goTo({
            center: [coords.longitude, coords.latitude],
            zoom: 16
        });
    });
    view.ui.add(locate, "top-left");

    // ------------- BasemapToggle widget ---------------
    var basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "hybrid"
    });
    // Add widget to the bottom left corner of the view
    view.ui.add(basemapToggle, {
        position: "bottom-left"
    });
});