---
web: 'https://www.dachbodenwien.at/'
address: Lerchenfelder Str. 1, 1070 Wien
outlook: O, S, W
maps: 'https://maps.app.goo.gl/Dt3Y9UipbUfFryq86'
sun: 'https://www.sonnenverlauf.de/#/48.2064,16.3547,19/2023.07.01/13:16/1/0'
---

a bar overlooking the roofs of the first district of vienna.

<div id="map" class="map"></div>

<script>

 
    var wfsUrl = 'https://haleconnect.com/ows/services/org.670.f74dd3a1-db68-4d7d-a2b7-29dde9fe7f51_wfs';

    // Create a vector layer TODO
    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        format: new ol.format.WFS(),
        url: function (extent) {
          return wfsUrl + '?service=WFS&' +
                 'version=2.0.0&request=GetFeature&' +
                 'typename=bu-core2d:Building&' +
                 'outputFormat=application/gml+xml; version=3.2' +
                 'bbox=' + extent.join(',') + ',EPSG:4258';
        },
        strategy: ol.loadingstrategy.bbox,
      }),
    });

    // Create a map
    var map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
        vectorLayer,
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    // Event listener for click on features
    map.on('click', function (event) {
      map.forEachFeatureAtPixel(event.pixel, function (feature) {
        console.log('Clicked on feature:', feature.getProperties());
      });
    });
</script>

