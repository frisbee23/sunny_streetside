async function calcsunniness(datetime, lat, lng)
{
  const sunPosition = SunCalc.getPosition(
     //new Date(),
     datetime, lat, lng);

  const sunAzimuth = Math.PI /2 - sunPosition.azimuth;
  const sunAlt = sunPosition.altitude * 180 / Math.PI;
   
  console.log (datetime, lat, lng, sunAzimuth, sunAlt);

  console.log("marching sundir");
    var centerCoordinates = osmap.getView().getCenter();
    console.log ('cc:' + centerCoordinates);
    
    features = vectorLayer.getSource().getFeaturesAtCoordinate(centerCoordinates)
    
    console.log ('features:' + features);

    startbuilding_id= features[0].getProperties().BW_GEB_ID;
    
    console.log ("startbuilding "+startbuilding_id);
}

function printsun()
{// https://www.npmjs.com/package/suncalc
  const now = new Date();
  const sunPosition = SunCalc.getPosition(now, poslat, poslng);
  const sunAltitude = sunPosition.altitude * (180 / Math.PI);

  document.getElementById('sunAngle').textContent = `Sun's altitude: ${sunAltitude.toFixed(2)} degrees`;
  document.getElementById('sunPosition').textContent = `position(azimuth): ${sunPosition.azimuth.toFixed(2)} degrees`;
}
printsun();