---
layout: default
web: 'http://www.trimelli.at/'
address: Landstraßer Hauptstraße 31, 1030 Wien
outlook: SW
maps: 'https://maps.app.goo.gl/QJ4AY5MfMieNdQmQA'
sun: 'https://www.sonnenverlauf.de/#/48.204,16.3893,19/2023.11.01/08:44/1/0'
---

xxx
<div id="map" class="map"></div>

<script>
/*
geht:
https://data.wien.gv.at/daten/geo?
service=WFS&request=GetFeature&
version=1.1.0&
typeName=ogdwien:HUNDESACKERLOGD&
srsName=EPSG:3857&
outputFormat=application/json&
bbox=1818298.9829030563,6140429.536597145,1824074.7558528553,6143295.9251578385,EPSG:3857

want:

https://data.wien.gv.at/daten/geo?
service=WFS&request=GetFeature&
typeName=ogdwien:FMZKBKMOGD
version=1.1.0
*/

    var vectorLayer = new ol.layer.Vector({ 
      source: new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function (extent) {
            console.log ('wfs request');
          return 'https://data.wien.gv.at/daten/geo' +
          '?service=WFS' + 
          '&request=GetFeature' +
          '&version=1.1.0' +
          '&typeName=ogdwien:FMZKBKMOGD'+
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
        //raster,
         new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
        vectorLayer,
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([16.3893, 48.204]),
        zoom: 20,
      }),
    });


        var centerCoordinates = map.getView().getCenter();

        var lineString = new ol.geom.LineString([
            centerCoordinates,  
             [centerCoordinates[0] - 50, centerCoordinates[1] - 50], 
        ]);
        var lineFeature = new ol.Feature(lineString);
        lineFeature.setStyle(
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                color: 'red',
                width: 2,  // Adjust the width of the line as needed
                }),
            })
            );

        vectorLayer.getSource().addFeature(lineFeature);




    // Event listener for click on features
    map.on('click', function (event) {
        var center = map.getView().getCenter();
        var resolution = map.getView().getResolution();
        var pixel = map.getPixelFromCoordinate([center[0] + resolution, center[1]]);
        var features = [];

        map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        features.push({
            id: feature.getId(),
            properties: feature.getProperties(),
        });
        });

        console.log('Features along the ray:', features);


      map.forEachFeatureAtPixel(event.pixel, function (feature) {
        console.log('Clicked on feature:', feature.getProperties());
      });
    });
</script>