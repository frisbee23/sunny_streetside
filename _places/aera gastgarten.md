---
layout: default
web: 'https://aera.at/'
address: Gonzagagasse 11, 1010 Wien
outlook: NW, NO
maps-link: 'https://maps.app.goo.gl/qXZHWFofVoUejWS89'
sun-link: 
related-place: aera
---
map:
<div id="map" style="height: 400px;"></div>

<script>
let map;
let center;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  center = { lat: 37.4161493, lng: -122.0812166 };
  map = new Map(document.getElementById("map"), {
    center: center,
    zoom: 14,
    mapId: 'DEMO_MAP_ID' // TODO: https://developers.google.com/maps/documentation/javascript/advanced-markers/start
  });
  findPlaces();
}

async function findPlaces() {
  const { Place } = await google.maps.importLibrary("places");
  //@ts-ignore
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const request = {
    textQuery: "Tacos in Mountain View",
    fields: ["displayName", "location", "businessStatus"],
    includedType: "restaurant",
    isOpenNow: true,
    language: "en-US",
    maxResultCount: 7,
    minRating: 3.2,
    region: "us",
    useStrictTypeFiltering: false,
  };
  //@ts-ignore
  const { places } = await Place.searchByText(request);

  if (places.length) {
    console.log(places);

    const { LatLngBounds } = await google.maps.importLibrary("core");
    const bounds = new LatLngBounds();

    // Loop through and get all the results.
    places.forEach((place) => {
      const markerView = new AdvancedMarkerElement({
        map,
        position: place.location,
        title: place.displayName,
      });

      bounds.extend(place.location);
      console.log(place);
    });
    map.setCenter(bounds.getCenter());
  } else {
    console.log("No results");
  }
}

initMap();
</script>

east side of the garden (really just tables on the street) has sun until 11:45 in summer.

the aera building is 30m high, and the main sunblocker until 15h;
then it's the opposite side of werdertorgasse, which are 34m high.

west side has sun from 15:00, but only for about an hour. (more data needed)

created: 2023-11-08
modified: Wednesday 8th November 2023 19:31:36

