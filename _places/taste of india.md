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

        vectorLayer.getSource().on('change', function(evt){
            const source = evt.target;
            if (source.getState() === 'ready') {
                const numFeatures = source.getFeatures().length;
                 console.log("vector layer loaded: " + numFeatures);
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

        //console.log('map init ' + coordinates);
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

       


        var centerCoordinates = map.getView().getCenter();
        console.log("center coords ", centerCoordinates);
        pixel= map.getPixelFromCoordinate(centerCoordinates);
        console.log("center pixel", pixel);

        const pointStyle = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6, // Adjust the radius as needed
                    fill: new ol.style.Fill({
                    color: 'red', // Set the fill color to red
                }),
                stroke: new ol.style.Stroke({
                 color: 'black', // Set the stroke color
                    width: 2, // Set the stroke width
                }),
                }),
            });
      
    
        console.log("marching the sundir");
        for (let i = 0; i <= 150; i+=10) {
           
            const coords=[
                centerCoordinates[0] - Math.cos(sunAzimuth)*i,
                centerCoordinates[1] - Math.sin(sunAzimuth)*i];

            pointGeometry = new ol.geom.Point(coords);
            pointFeature = new ol.Feature(pointGeometry);
            pointFeature.setStyle(pointStyle);
            vectorLayer.getSource().addFeature(pointFeature);
            
            //const features = vectorLayer.getSource().getClosestFeatureToCoordinate(coords);

            //const features = vectorLayer.getSource().getFeaturesAtCoordinate(coords);
            pixel= map.getPixelFromCoordinate(coords);
            console.log(coords, pixel);

            map.forEachFeatureAtPixel(pixel, 
                function (feature) {
                    console.log('detected feature:', feature.getProperties());
            });
            
            
            
        }

        var lineString = new ol.geom.LineString([
            centerCoordinates,  
            [
             centerCoordinates[0] - Math.cos(sunAzimuth)*100, 
             centerCoordinates[1] - Math.sin(sunAzimuth)*100
            ]
        ]);

        /*var lineFeature = new ol.Feature(lineString);
        lineFeature.setStyle(
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                color: 'green',
                width: 2,  // Adjust the width of the line as needed
                }),
            })
            );
        //console.log (lineFeature);
        vectorLayer.getSource().addFeature(lineFeature);
        */

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

    const futureDate = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);

    const sunPosition = SunCalc.getPosition( //new Date(),
    futureDate, latitude, longitude);
    
createMap("Marxergasse%2019", sunPosition);




/*
coordinaten des restaurants

//*/


</script>