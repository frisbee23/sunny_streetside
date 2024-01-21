---
layout: default
web: 'https://honu.at/'
address: Landstraßer Hauptstraße 19, 1030 Wien
outlook: SW (226°)
maps: 'https://maps.app.goo.gl/ME3USj3NTHVeGo3S9'
sun: 'https://www.sonnenverlauf.de/#/48.2047,16.3882,18/2023.07.01/14:36/1/0'
sunblock-distance: 23m
sunblock-height: 30m
sun-angle-180-december: 18°
sun-angle-180-june: 25°
---

<h2>My Map</h2>
<div id="map" class="map"></div>

<script type="text/javascript">
    proj4.defs('EPSG:28992','+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs'); 

    proj4.defs("EPSG:31256","+proj=tmerc +lat_0=0 +lon_0=16.3333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs +type=crs");

    ol.proj.proj4.register(proj4);

    var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
        source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([16.39054876321797, 48.210862381899666]),
        zoom: 20
    })
    });
    map.on('moveend', function (evt) {

        let bbox = map.getView().calculateExtent();
        console.log(bbox);

        let bbox28992 = ol.proj.transformExtent(bbox, 'EPSG:3857', 'EPSG:31256')
        console.log(bbox28992);
    });

</script>






