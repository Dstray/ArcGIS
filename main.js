/*!
 * ArcGIS v0.1.0 (http://dstray.github.io/ArcGIS)
 * Copyright 2017- Dstray
 * Licensed under the MIT license
 */

require([
        "esri/Graphic",
        "esri/Map",
        "esri/PopupTemplate",
        "esri/geometry/Point",
        "esri/layers/GraphicsLayer",
        "esri/tasks/Locator",
        "esri/symbols/PictureMarkerSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/views/MapView",
        "esri/widgets/BasemapToggle",
        "esri/widgets/Expand",
        "esri/widgets/Locate",
        "esri/widgets/Search",
        "dojo/dom",
        "dojo/dom-construct",
        "dojo/domReady!"
    ], function(
        Graphic,
        Map, 
        PopupTemplate,
        Point,
        GraphicsLayer,
        Locator, 
        PictureMarkerSymbol,
        SimpleMarkerSymbol,
        MapView, 
        BasemapToggle, 
        Expand,
        Locate, 
        Search,
        dom,
        domConstruct
    ){

    var map = new Map({
        basemap: "streets-relief-vector"
    });

    var view = new MapView({
        container: "mapView",
        map: map,
        center: [-87.6298, 41.8781], // Chicago
        zoom: 9,
        popup: {
            dockEnabled: true,
            dockOptions: {
                // Disables the dock button from the popup
                buttonEnabled: false,
                // Ignore the default sizes that trigger responsive docking
                breakpoint: false
            }
        }
    });

    // ------------- Expand widget ---------------
    var qExpand = new Expand({
        view: view,
        content: dom.byId("query"),
        expandIconClass: "esri-icon-drag-horizontal"
    });
    view.ui.add(qExpand, "top-right");

    // ------------- Point graphic ---------------
    var pointGraphic = null;
    var redMarkerSymbol = new SimpleMarkerSymbol({
        color: [216, 0, 0],
        outline: {
            color: [255, 255, 255],
            width: 1
        }
    });
    var greyMarkerSymbol = new SimpleMarkerSymbol({
        color: [144, 144, 144],
        outline: {
            color: [255, 255, 255],
            width: 1
        }
    });
    var markerSymbol = new PictureMarkerSymbol({
        url: "./marker.png",
        width: 32,
        height: 32,
        yoffset: 16
    });

    // ------------- Popup Templates ---------------
    var locPopupTemp = {
        title: "{Address}",
        content: "<p><b>Address</b>: {Match_addr}</p>" + 
            "<p><b>Coordinate</b>: [{Lon}, {Lat}]</p>"
    };

    // ------------- Locator task ---------------
    var locator = new Locator({
        url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
    });
    view.on("click", function(event){
        if (event.button != 0) return;
        view.popup.clear();

        /*var lat = Math.round(event.mapPoint.latitude * 10000) / 10000;
        var lon = Math.round(event.mapPoint.longitude * 10000) / 10000;*/

        // point graphic
        if (pointGraphic != null)
            view.graphics.remove(pointGraphic);
        pointGraphic = new Graphic({
            geometry: event.mapPoint,
            symbol: markerSymbol
        });
        view.graphics.add(pointGraphic);

        locator.locationToAddress(event.mapPoint).then(function(response){
            var lat = event.mapPoint.latitude;
            var lon = event.mapPoint.longitude;
            //console.log(response.address);
            //pointGraphic.attributes = response.address;

            qExpand.collapse();
            view.popup.open({
                title: response.address.Address,
                content: "<p><b>Address</b>: " + response.address.Match_addr + "</p>" + 
                    "<p><b>Coordinate</b>: [" + lat + ", " + lon + "]</p>",
                location: event.mapPoint
            });
        }, function(error){
            console.log(error);
        });
    });

    // ------------- Search widget ---------------
    var search = new Search({
        //view: view
    });
    //search.defaultSource.withinViewEnabled = true; // Limit search to visible map area only
    //view.ui.add(search, "top-right"); // Add to the view

    // ------------- Locate widget ---------------
    var curCoords = null;
    var locate = new Locate({
        view: view
    });
    locate.goToLocationEnabled = false;
    locate.on("locate", function(geoloc){
        curCoords = geoloc.position.coords
        //console.log(curCoords);
        view.goTo({
            center: [curCoords.longitude, curCoords.latitude],
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

    // ------------- Search query ---------------
    var resLayer = new GraphicsLayer();
    var sinput = dom.byId("search-input");
    var searchfunc = function(){
        if (sinput.value === "") return;
        console.log(sinput.value);/*
        locator.addressToLocations({
            address: {
                "field_name": "380 New York St, Redlands, CA 92373"
            }
        }).then(function(cands){
            console.log(cands);
        });*/
        resLayer.removeAll();
        search.search(sinput.value).then(function(results){
            results = results[0].results;
            for (let res of results) {
                if (res.feature.attributes.score < 90) continue;
                res.feature.symbol = greyMarkerSymbol;
                resLayer.add(res.feature);
            }
            
            var resDiv = dom.byId("result-container");
            for (var i = 0; i != resLayer.graphics.length; i++) {
                var gr = resLayer.graphics.getItemAt(i);
                domConstruct.create("div", {
                    innerHTML: "<b>" + gr.attributes.Match_addr + "</b><p>" +
                        gr.geometry.latitude + ", " + gr.geometry.longitude + "</p>",
                    idx: i,
                    class: "search-result-item"
                }, resDiv);
            }
        });
    };
    dom.byId("search-form").onkeypress = function(event){
        if ((event.keyCode || event.which || event.charCode || 0) === 13) {
            searchfunc();
            return false;
        }
    };
    dom.byId("search-button").onclick = searchfunc;
    map.add(resLayer);
});