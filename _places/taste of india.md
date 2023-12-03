---
layout: default
web: 'http://www.taste-of-india.at/'
address: Marxergasse 19, 1030 Wien
outlook: WNW, SSW
maps: 'https://maps.app.goo.gl/iaJyNe6BJ2Kap4GZ7'
sun: 'https://www.sonnenverlauf.de/#/48.2065,16.3916,19/2023.07.01/13:16/1/0'
---

<div id="map" class="map"></div>

<script>
// https://digitales.wien.gv.at/wp-content/uploads/sites/47/2019/01/adressservice-doku.pdf

var geocodeapi='http://data.wien.gv.at/daten/OGDAddressService.svc/GetAddressInfo?crs=EPSG:3857&Address=';


async function logMovies() {
  const response = await fetch("http://example.com/movies.json");
  const movies = await response.json();
  console.log(movies);
}


async function fetchData(addr)
{
    try {
       const response= await fetch(geocodeapi+addr)
       const data= await response.json();
       mypoint=data.features[0].geometry.coordinates;
       return mypoint;

    } catch (error) {
      console.error('Error fetching data:', error);
    }
}


async function createMap(addr, sunPosition)
{
    try {
        // Wait for the fetch operation to complete
        const coordinates = await fetchData(addr);

        const lonLatCoordinate = ol.proj.toLonLat(coordinates);
        console.log('Longitude/Latitude:', lonLatCoordinate);
        
        var vectorLayer = new ol.layer.Vector({ 
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: function (extent) {
                   // console.log ('wfs request');
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

        vectorLayer.getSource().on('change', 
            function(evt){
            const source = evt.target;
            const numFeatures = source.getFeatures().length;

            if (source.getState() != 'ready' || numFeatures<2) 
                return;

            console.log("marching the sundir");
            var centerCoordinates = map.getView().getCenter();

            for (let i = 0; i <= 150; i+=10) {
                coords=[centerCoordinates[0] - Math.cos(sunAzimuth)*i,
                    centerCoordinates[1] - Math.sin(sunAzimuth)*i];

                features = vectorLayer.getSource().getFeaturesAtCoordinate(coords);
                console.log(features);
            }
        
        });

        // adjust so angle is measured counterclockwise 
        //   from the positive x-axis
        var sunAzimuth = Math.PI /2 - sunPosition.azimuth;

        var sunAlt = sunPosition.altitude * 180 / Math.PI;

        console.log("sunAlt "+sunAlt );

        console.log("sunAzimuth "+ sunPosition.azimuth*180/Math.PI);
        console.log("adj sunAzimuth "+ sunAzimuth*180/Math.PI);

        const key = 'i9xwr1qrYDFkU4CYpnLq';
        const raster = new ol.layer.Tile({
            source: new ol.source.XYZ({
            url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
            maxZoom: 20,
            }),
        });
       
     
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
                center:  coordinates, //ol.proj.fromLonLat([16.3893, 48.204]),
                zoom: 20,
            }),
        });
/*
        var centerCoordinates = map.getView().getCenter();
        var lineString = new ol.geom.LineString([
            centerCoordinates,  
            [
             centerCoordinates[0] - Math.cos(sunAzimuth)*100, 
             centerCoordinates[1] - Math.sin(sunAzimuth)*100
            ]
        ]);
        vectorLayer.getSource().addFeature(lineString);*/


    } catch (error) {
        // Handle errors, log them, or display an error message
        console.error('Error creating map:', error);
    }

       


     map.on('click', function (event) {
        var center = map.getView().getCenter();
        var resolution = map.getView().getResolution();
        
        var features = [];

        map.forEachFeatureAtPixel(event.pixel, function (feature) {
        console.log('Clicked on pixel:', event.pixel);    
        console.log('Clicked on feature:', feature.getProperties());
        console.log('Clicked on feature:', feature);
        
        map.getView().fit(feature.getGeometry().getExtent(), { padding: [10, 10, 10, 10], duration: 500 });

      });


    });
 
}
  
// taste of india coords
const latitude =  48.20644906; 
const longitude = 16.39176681;

const futureDate = new Date(new Date().getTime() - 4 * 60 * 60 * 1000);

const sunPosition = SunCalc.getPosition( //new Date(),
futureDate, latitude, longitude);
    
createMap("Marxergasse%2019", sunPosition);


</script>