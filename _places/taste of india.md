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

var map;
var foundbuilding=false;
var kote=0;

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

    if (foundbuilding || source.getState() != 'ready' || numFeatures<2) 
        return;

    console.log("marching the sundir");
    var centerCoordinates = map.getView().getCenter();

    features=[]
    for (let i = 10; i <= 150; i+=10) {
        coords=[centerCoordinates[0] - Math.cos(sunAzimuth)*i,
            centerCoordinates[1] - Math.sin(sunAzimuth)*i];

        features = vectorLayer.getSource().getFeaturesAtCoordinate(coords);
        if (features.length >0)
        {
            console.log(features);
            console.log(
                "found building: "+ "id: " + features[0].getProperties().FMZK_ID+
                " height: "+features[0].getProperties().O_KOTE
                );
            kote=features[0].getProperties().O_KOTE;

            if (!foundbuilding)
            {
                foundbuilding=true;
                var lineString = new ol.geom.LineString([
                    centerCoordinates,  
                        [centerCoordinates[0] - Math.cos(sunAzimuth) *50, 
                        centerCoordinates[1] - Math.sin(sunAzimuth) *50], 
                ]);
                var lineFeature = new ol.Feature(lineString);   
                lineFeature.setStyle(
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                        color: 'red',
                        width: 2,  
                        }),
                    })
                    );
                vectorLayer.getSource().addFeature(lineFeature);
                        break;
            }
        }
    }
});

///////////////////////////////////////

async function createMap(addr) //130
{
    try {
        // Wait for the fetch operation to complete
        const coordinates = await fetchData(addr);

        const lonLatCoordinate = ol.proj.toLonLat(coordinates);
        console.log('Longitude/Latitude:', lonLatCoordinate);

        console.log("sunAlt "+sunAlt );

        console.log("sunAzimuth "+ sunAzimuth);
   
        const key = 'i9xwr1qrYDFkU4CYpnLq';
        const raster = new ol.layer.Tile({
            source: new ol.source.XYZ({
            url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
            maxZoom: 20,
            }),
        });
       
        map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                source: new ol.source.OSM(),
                }),
                vectorLayer,
            ],
            view: new ol.View({
                center:  coordinates, 
                zoom: 20,
            }),
        });
    } catch (error) {
        console.error('Error creating map:', error);
    }
}
  
// taste of india coords
const latitude =  48.20644906; 
const longitude = 16.39176681;

const futureDate = new Date(new Date().getTime() - 2 * 60 * 60 * 1000 + 1000*60*8);
console.log (futureDate)
const sunPosition = SunCalc.getPosition(
     //new Date(),
    futureDate, latitude, longitude);

// adjust so angle is measured counterclockwise 
//   from the positive x-axis
const sunAzimuth = Math.PI /2 - sunPosition.azimuth;

const sunAlt = sunPosition.altitude * 180 / Math.PI;
    
createMap("Marxergasse%2019");

console.log("kote: "+kote)


 


</script>