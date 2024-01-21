

async function initOSMap()
{
  console.log('init os map');
     //proj4.defs("EPSG:31256","+proj=tmerc +lat_0=0 +lon_0=16.33333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs +type=crs");
  proj4.defs("EPSG:31256", "+proj=tmerc +lat_0=0 +lon_0=16.33333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs");

  
  // last https://github.com/openlayers/openlayers/issues/11632
  
  //proj4.defs("EPSG:31256",  'GEOGCS["MGI",DATUM["Militar-Geographische Institut",SPHEROID["Bessel 1841",6377397.155,299.1528128,AUTHORITY["EPSG","7004"]],AUTHORITY["EPSG","6312"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9102"]],AXIS["Lat",north],AXIS["Lon",east],AUTHORITY["EPSG","4312"]],PROJECTION["Transverse Mercator",AUTHORITY["EPSG","18006"]],PARAMETER["Latitude of natural origin",0,AUTHORITY["EPSG","8801"]],PARAMETER["Longitude of natural origin",16.3333333333336,AUTHORITY["EPSG","8802"]],PARAMETER["Scale factor at natural origin",1,AUTHORITY["EPSG","8805"]],PARAMETER["False easting",0,AUTHORITY["EPSG","8806"]],PARAMETER["False northing",-5000000,AUTHORITY["EPSG","8807"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",north],AXIS["Y",east],AUTHORITY["EPSG","31256"]]')
 
  //ol.proj.proj4.register(proj4);
  const epsg31256projection=ol.proj.get('EPSG:31256');
  console.log(epsg31256projection);

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
        '&srsName=EPSG:31256' +
        '&outputFormat=application/json' +
        '&bbox=' + extent.join(',') + ',EPSG:31256';
        },
        strategy: ol.loadingstrategy.bbox,
    }),
  });

  try {
       //TODO don't hardcode
       const coordinates = await fetchData(
        //"Löwengasse%2041");
        "Radetzkyplatz%204"
        );
       console.log("initosmap: coordinates: "+coordinates);

        osmap = new ol.Map({
            target: 'domOSmap',
            layers: [
                new ol.layer.Tile({
                source: new ol.source.OSM(),
                }),
                vectorLayer,
            ],
            projection: epsg31256projection,
            view: new ol.View({
                center: coordinates,
                zoom: 19,
            }),
        });

        var lineString = new ol.geom.LineString([
                  coordinates,  coordinates+1
                ]);
                var lineFeature = new ol.Feature(lineString);   
                lineFeature.setStyle(
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                        color: 'red',
                        width: 1,  
                        }),
                    })
                    );
        vectorLayer.getSource().addFeature(lineFeature);
       
    } catch (error) {
        console.error('Error creating map:', error);
    }
    // last: when this is commented in, we loose the features display

   
}

vectorLayer.getSource().on('change', 
    function(evt)
    {
      const source = evt.target;
      const numFeatures = source.getFeatures().length;
      console.log ('vectorlayer::source::onchange -> feature count: '+numFeatures);
    });

vectorLayer.getSource().on('featuresloadend', 
    function(evt)
    {
      
      console.log ('vectorlayer::source::onfeatureloadend');
    });  

async function fetchFeaturesLatlang(lat, lng)
{
    /*
    //proj4.defs("EPSG:31256","+proj=tmerc +lat_0=0 +lon_0=16.3333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=427.914,105.528,510.908,-4.992523,-5.898813,10.306673,12.431493 +units=m +no_defs +type=crs");
    proj4.defs("EPSG:31256","+proj=tmerc +lat_0=0 +lon_0=16.3333333333333 +k=1 +x_0=0 +y_0=-5000000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs +type=crs");

    proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs');
    
    var sourceCoordinates = [lng, lat];
    
    console.log('Source Coordinates (EPSG:3857) DEG:', sourceCoordinates);
    var sourceCoordinates_metres = ol.proj.fromLonLat(sourceCoordinates);
    console.log('Source Coordinates (EPSG:3857) METRES: '+sourceCoordinates_metres);

    var targetCoordinates = proj4('GOOGLE', "EPSG:31256", sourceCoordinates_metres);
    console.log('Target Coordinates (EPSG:31256):', targetCoordinates);
    
    var olTargetCoordinates =targetCoordinates;
    // ol.proj.fromLonLat(targetCoordinates, 'EPSG:31256');

    features = vectorLayer.getSource().getFeaturesAtCoordinate(olTargetCoordinates);
    console.log ('features'+features); 
    */
}
    
function getFeaturesAtCoordinateAsync(coordinate) {
    return new Promise((resolve, reject) => {
    const features = vectorLayer.getSource().getFeaturesAtCoordinate(coordinate);
    if (features) {
        resolve(features);
    } else {
        reject("No features found at the given coordinate");
    }
    });
}
async function fetchFeatures(addr)
{
    coordinates = await fetchData(addr);

    coordinates=[4313.71,341418.44];
    console.log(coordinates);
    //const lonLatCoordinate = ol.proj.toLonLat(coordinates, "EPSG:31256");
    //console.log('fetch features coordinates: '+lonLatCoordinate);
    
    // todo
    getFeaturesAtCoordinateAsync(coordinates)
    .then((features) => {
    console.log("Features found:", features, features[0].getProperties());
    })
    .catch((error) => {
    console.error("Error:", error);
    });
    
}