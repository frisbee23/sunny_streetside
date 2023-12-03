---
layout: default
web: 'https://www.dachbodenwien.at/'
address: Lerchenfelder Str. 1, 1070 Wien
outlook: O, S, W
maps: 'https://maps.app.goo.gl/Dt3Y9UipbUfFryq86'
sun: 'https://www.sonnenverlauf.de/#/48.2064,16.3547,19/2023.07.01/13:16/1/0'
---

a bar overlooking the roofs of the first district of vienna.

<div id="map" class="map"></div>

<script>
    var vectorLayer = new ol.layer.Vector({ 
      source: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function (extent) {
            console.log ('wfs request');
          return 'https://data.wien.gv.at/daten/geo' +
          '?service=WFS' + 
          '&request=GetFeature' +
          '&version=1.1.0' +
          '&typeName=ogdwien:HUNDESACKERLOGD'+
          '&srsName=EPSG:3857' +
          '&outputFormat=application/json' +
          '&bbox=' + extent.join(',') + ',EPSG:3857';
        },
        strategy: ol.loadingstrategy.bbox,
      }),
    });

    vectorLayer.getSource().on('change', function(evt){
      const source = evt.target;
      if (source.getState() === 'ready') {
        const numFeatures = source.getFeatures().length;
        console.log("Count after change: " + numFeatures);
      }
    });

    const key = 'i9xwr1qrYDFkU4CYpnLq';
    const raster = new ol.layer.Tile({
      source: new ol.source.XYZ({
      url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
      maxZoom: 20,
    }),
    });
/*  new ol.layer.Tile({
          source: new ol.source.OSM(),
        }), */
    var map = new ol.Map({
      target: 'map',
      layers: [
        raster,
        vectorLayer,
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([16.360, 48.210]),
        zoom: 15,
      }),
    });

    // Event listener for click on features
    map.on('click', function (event) {
      map.forEachFeatureAtPixel(event.pixel, function (feature) {
        console.log('Clicked on feature:', feature.getProperties());
      });
    });
</script>

