//console.log("main")

let map; // googlemap
var osmap; // openstreet
var vectorLayer;
let center;

var poslng=16.390181530090295;
var poslat=48.21125728190052;


var radiusInMeters=1000/2;

var myplaces;

var geocodeapi='http://data.wien.gv.at/daten/OGDAddressService.svc/GetAddressInfo?crs=EPSG:31256&Address=';

const futureDate = new Date(new Date().getTime() - 10 * 60 * 60 * 1000 + 1000*60*8);


var search_done=false;
var kote=0;

let globalLongitude;
let globalLatitude;

async function getGeolocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                globalLongitude = position.coords.longitude;
                resolve(globalLongitude);

                globalLatitude = position.coords.latitude;
                resolve(globalLatitude);
            },
            (error) => {
                reject(error);
            }
        );
    });
}


async function waitforgeoloc() {
    try {
        await getGeolocation();
        console.log("Longitude:", globalLongitude);
        console.log("Latitude:", globalLatitude);
    } catch (error) {
        console.error("Error getting geolocation:", error);
    }
}

//TODO comment in when we really start with the users current loc.
//waitforgeoloc();

async function fetchData(addr)
{
    try {
       const response= await fetch(geocodeapi+addr)
       const data= await response.json();
       mypoint=data.features[0].geometry.coordinates;
       //console.log ('mypoint'+data.features[0].geometry);
       return mypoint;

    } catch (error) {
      console.error('Error fetching data:', error);
    }
}


