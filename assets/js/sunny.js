
function calcsun(evt)
{
  console.log ('vectorlayer::source::onfeatureloadend calcsun func', evt);

  const numFeatures = evt.target.getFeatures().length;
  console.log ('onfeatureloadend feature count: '+numFeatures);

  //const futureDate =  new Date(2024, 5, 21,12,0,0);
  //new Date(new Date().getTime() - 12 * 60 * 60 * 1000 + 1000*60*8);
  console.log ('sun at date:', futureDate)
  const sunPosition = SunCalc.getPosition(
      new Date(),
      //futureDate, 
      poslat, poslng); //TODO: do for each places' coords

  // adjust so angle is measured counterclockwise 
  //   from the positive x-axis
  const sunAzimuth = Math.PI /2 - sunPosition.azimuth;
  const sunAlt = sunPosition.altitude * 180 / Math.PI;

  myplaces.forEach((place) => {
    //console.log(place);
    
    plat=  place.location.lat();
    plng=  place.location.lng();
    pcoordsm = ol.proj.fromLonLat([ plng, plat]);
    console.log(place.displayName, pcoordsm)
    
    features = vectorLayer.getSource().getFeaturesAtCoordinate(pcoordsm);

    if (features.length==0) 
    {
      console.log ('features is 0');
      return 0
    }
    startbuilding_id=features[0].getProperties().BW_GEB_ID;
    //console.log ("startbuilding "+startbuilding_id);

    outside_startbuilding=[];
    search_done=false;
    for (let i = 1; i <= 150; i+=1) {
      coords=[pcoordsm[0] - Math.cos(sunAzimuth)*i,
              pcoordsm[1] - Math.sin(sunAzimuth)*i];
      features = vectorLayer.getSource().getFeaturesAtCoordinate(coords);
      if (features.length==0 && outside_startbuilding.length==0)
      {
          //console.log ("found outside, setting first outside_startbuilding point")
          outside_startbuilding=coords;
      }

      // depending on the sunangle, if the distance to next building is greater than X
      // we can stop searching, since at X a building would be like 100 meters high, 
      // which is not realistic TODO

      nextbuilding_id=0;
      if (features.length==0)
      {
          //         continue
      }
      else
          nextbuilding_id=features[0].getProperties().BW_GEB_ID;


      // TODO: function !
      // to calc dist, Haversine formula is designed for spherical Earth,
      // and Web Mercator uses a slightly different projection. for short distances it's ok
      if (outside_startbuilding.length==0)
      {
          dX=coords[0]-pcoordsm[0];
          dY=coords[1]-pcoordsm[1];
          dist=Math.sqrt(dX*dX + dY * dY);
          //console.log( "building id " + nextbuilding_id +      " dist "+dist          );
      }
      else
      {
          dX=coords[0]-outside_startbuilding[0];
          dY=coords[1]-outside_startbuilding[1];
          dist=Math.sqrt(dX*dX + dY * dY);
          // console.log("OUTSIDE building id " + nextbuilding_id +" dist "+dist );
      }

      if (nextbuilding_id==startbuilding_id || features.length==0)
      {
          continue;
      }
      kote=features[0].getProperties().O_KOTE;
      bangle=Math.atan2(kote, dist) * (180 / Math.PI);
      console.log("angle to top of building: "+ bangle + " sunAlt: "+sunAlt      );
      
      if (sunAlt > bangle) 
        console.log ('-> SUNNY!');

      //draw_search_line(pcoordsm, coords, 'red');
      draw_search_line(outside_startbuilding, coords, 'green');
      break;
      
    }
  });
}  

function draw_search_line(p1, p2, col)
{
    var lineString = new ol.geom.LineString([
                    p1,  p2 
    ]);
    var lineFeature = new ol.Feature(lineString);   
    lineFeature.setStyle(
        new ol.style.Style({
            stroke: new ol.style.Stroke({
            color: col,
            width: 3,  
            }),
        })
        );
    vectorLayer2.getSource().addFeature(lineFeature);
}

// TODO: visualize whole day and store sun hours

// TODO: do that for the whole year, or at some important dates, with some resolution


function printsun()
{// https://www.npmjs.com/package/suncalc
  const now = new Date();
  const sunPosition = SunCalc.getPosition(now, poslat, poslng);
  const sunAltitude = sunPosition.altitude * (180 / Math.PI);

  document.getElementById('sunAngle').textContent = `Sun's altitude: ${sunAltitude.toFixed(2)} degrees`;
  document.getElementById('sunPosition').textContent = `position(azimuth): ${sunPosition.azimuth.toFixed(2)} degrees`;
}
printsun();