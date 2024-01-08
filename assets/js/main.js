console.log("main")

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

waitforgeoloc();