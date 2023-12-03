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
var search_done=false;
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

    if (search_done || source.getState() != 'ready' || numFeatures<2) 
        return;

    console.log("marching the sundir");
    var centerCoordinates = map.getView().getCenter();

    features = vectorLayer.getSource().getFeaturesAtCoordinate(centerCoordinates)
    startbuilding_id=features[0].getProperties().BW_GEB_ID;
    console.log ("startbuilding "+startbuilding_id);

    //TODO: get building id at start
    // dont stop till we got a new building id

    outside_startbuilding=[];
    for (let i = 1; i <= 150; i+=1) {
        coords=[centerCoordinates[0] - Math.cos(sunAzimuth)*i,
            centerCoordinates[1] - Math.sin(sunAzimuth)*i];

        features = vectorLayer.getSource().getFeaturesAtCoordinate(coords);
        if (features.length==0 && outside_startbuilding.length==0)
        {
            console.log ("found outside, setting first outside_startbuilding point")
            outside_startbuilding=coords;
        }


        nextbuilding_id=0
        if (features.length==0)
        {
           //         continue
        }
        else
            nextbuilding_id=features[0].getProperties().BW_GEB_ID

        // to calc dist, Haversine formula is designed for spherical Earth, and Web Mercator uses a slightly different projection. for short distances it's ok
        if (outside_startbuilding.length==0)
        {
            dX=coords[0]-centerCoordinates[0];
            dY=coords[1]-centerCoordinates[1];
            dist=Math.sqrt(dX*dX + dY * dY);
            console.log(
            "building id " + nextbuilding_id +
             " dist "+dist
            );
        }
        else
        {
            dX=coords[0]-outside_startbuilding[0];
            dY=coords[1]-outside_startbuilding[1];
            dist=Math.sqrt(dX*dX + dY * dY);
            console.log(
            "OUTSIDE building id " + nextbuilding_id +
            " dist "+dist
            );
        }
        
                
        if (nextbuilding_id==startbuilding_id || features.length==0)
        {
            continue;
        }
        kote=features[0].getProperties().O_KOTE;
        console.log("angle to top of building "+ Math.atan2(kote, dist) * (180 / Math.PI));

        if (!search_done)
        {
            search_done=true;
            draw_search_line(centerCoordinates, 'red');
            draw_search_line(outside_startbuilding, 'green');
            break;
        }
        
    }
});

function draw_search_line(centerCoordinates, col)
{
    var lineString = new ol.geom.LineString([
                    centerCoordinates,  coords 
                ]);
                var lineFeature = new ol.Feature(lineString);   
                lineFeature.setStyle(
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                        color: col,
                        width: 1,  
                        }),
                    })
                    );
                vectorLayer.getSource().addFeature(lineFeature);
}

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