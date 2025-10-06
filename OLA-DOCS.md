Ola-Maps-Web SDK Setup
This documentation provides setup guide for ola maps web SDK
Setup
CDN Usage
Inject the minified script into your app using script tag
HTML

<script src="https://www.unpkg.com/olamaps-web-sdk@latest/dist/olamaps-web-sdk.umd.js"></script>
Using Package Manager
Install via npm
BASH

npm install olamaps-web-sdk
Import OlaMaps class
JAVASCRIPT

import { OlaMaps } from 'olamaps-web-sdk'
If you are using Next.js then import sdk as below.
JAVASCRIPT

import('olamaps-web-sdk').then((module) => {
  const { OlaMaps } = module 
  // initialize and render map here
})
Initialization
Get Api Key from credentials and initialize OlaMaps
JAVASCRIPT

const olaMaps = new OlaMaps({
    apiKey: [YOUR_API_KEY],
})

Call init method to render the map
JAVASCRIPT

const myMap = olaMaps.init({
  style: [ADD THE LINK OF TILES STYLE JSON HERE],
  container: [MAP CONTAINER ID],
  center: [INITIAL LAT LAN POSITION],
  zoom: [SET ZOOM NUMBER]
})
If you encounter any issues while integrating the SDK, please report them on our GitHub Issues page.
Example
Ola Maps | © OpenStreetMap contributors
JAVASCRIPT
HTML

const myMap = olaMaps.init({
  style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
  container: 'map',
  center: [77.61648476788898, 12.931423492103944],
  zoom: 15,
})
If you want to render map in local languages, check the languages we support in style json in vector map tiles APIs. You need to add -[LANGUAGE CODE] to styleName.
Ola Maps | © OpenStreetMap contributors
JAVASCRIPT
HTML

const myMap = olaMaps.init({
    style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard-mr/style.json",
    container: 'map',
    center: [77.61648476788898, 12.931423492103944],
    zoom: 15,
    })
To initialize 3d maps, we need to use additional parameter 'mode' and need to give the tileset endpoint.
JAVASCRIPT

const olaMaps3D = new OlaMaps({
  apiKey: [YOUR_API_KEY],
  mode: "3d",
  threedTileset: "https://api.olamaps.io/tiles/vector/v1/3dtiles/tileset.json",
})
Ola Maps | © OpenStreetMap contributors
JAVASCRIPT
HTML

const myMap = olaMaps.init({
  style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
  container: 'map-3d',
  center: [72.84185896191035, 19.04116993331655],
  zoom: 15,
})





-----------------------------------------------------
\Adding Markers & info windows in map
This documentation provides methods for adding markers and info windows to marker.
Adding Default Marker
JAVASCRIPT

olaMaps
  .addMarker({ offset: [SET OFFSET POSITION], anchor: [SET ANCHOR POSITION] })
  .setLngLat([SET MARKER COORDINATES])
  .addTo(myMap)
Set custom color marker
JAVASCRIPT

olaMaps
  .addMarker({ offset: [SET OFFSET POSITION], anchor: [SET ANCHOR POSITION], color:[SET COLOR] })
  .setLngLat([SET MARKER COORDINATES])
  .addTo(myMap)
Set draggable marker
JAVASCRIPT

olaMaps
  .addMarker({ offset: [SET OFFSET POSITION], anchor: [SET ANCHOR POSITION], color:[SET COLOR], draggable:true })
  .setLngLat([SET MARKER COORDINATES])
  .addTo(myMap)
Adding custom marker
Add your custom marker image
JAVASCRIPT

.customMarkerClass {
    height: 30px;
    width: 40px;
    background-image: [YOUR CUSTOM MARKER IMAGE];
  }
Create a div and add append styles to that div
JAVASCRIPT

var customMarker = document.createElement('div')
customMarker.classList.add('customMarkerClass')
Add div to element options in marker
JAVASCRIPT

olaMaps
  .addMarker({element: customMarker, offset: [SET OFFSET POSITION], anchor: [SET ANCHOR POSITION] })
  .setLngLat([SET MARKER COORDINATES])
  .addTo(myMap)
Get marker position on drag
JAVASCRIPT

const marker = olaMaps
  .addMarker([MARKER STYLES])
  .addTo(myMap)

function onDrag() {
  const lngLat = marker.getLngLat()
}

marker.on('drag', onDrag)
Remove Marker
JAVASCRIPT

const marker = olaMaps
  .addMarker([MARKER STYLES])
  .addTo(myMap)

marker.remove();
Adding info windows to your marker
You can set text or add an HTML element to marker info windows
Create info windows and set text to your info windows
JAVASCRIPT

const popup = olaMaps
  .addPopup({ offset: [SET OFFSET POSITION], anchor: [SET ANCHOR POSITION] })
  .setText([SET YOUR POPUP TEXT])
Create info windows and set HTML element to your info windows
JAVASCRIPT

const popup = olaMaps
  .addPopup({ offset: [SET OFFSET POSITION], anchor: [SET ANCHOR POSITION] })
  .setHTML([ADD YOUR POPUP ELEMENT])
Adding info windows to your markers
JAVASCRIPT

olaMaps
  .addMarker([MARKER STYLES])
  .setPopup(popup)
  .addTo(myMap)
Example
Ola Maps | © OpenStreetMap contributors
JAVASCRIPT
HTML


let olaMap = olaMaps.init({
          style: 'https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json',
          container: 'map',
          center: [77.61648476788898, 12.932223492103944],
          zoom: 15,
        })
----------------------------------------------------------------------------------

Adding static maps
This documentation provides methods for adding static maps in web sdk
Add a HTML div element and give id to that element.
HTML

<div id='[MAP ID]'></div>
Go to Map Tiles APIs, generate URL of the map you want to add from Static Map Tiles and copy the Request URL.
Use getStaticMap method use render static map and pass maps request URL and id.
JAVASCRIPT

olaMaps.getStaticMap('[STATIC MAP URL]','MAP ID')
Example

JAVASCRIPT
HTML

olaMaps.getStaticMap(
  'https://api.olamaps.io/tiles/v1/styles/default-light-standard/static/77.61,12.93,15/800x600.png?marker=77.61%2C12.93%7Cred%7Cscale%3A0.9&path=77.61%2C12.93%7C77.61190639293811%2C12.937637130956137%7Cwidth%3A6%7Cstroke%3A%2300ff44&api_key=[API_KEY]',
  'map',
)

_------------------------------------------------------------------------------------4

Get Current Location using addGeolocateControls
This documentation provides methods for getting, tracking users current location using addGeolocateControls
This provides a button that uses the browser's geolocation API to locate the user on the map.
This has two modes. If trackUserLocation is false (default) the control acts as a button, which when pressed will set the map's camera to target the user location. If the user moves, the map won't update. This is most suited for the desktop. If trackUserLocation is true the control acts as a toggle button that when active the user's location is actively monitored for changes. In this mode the GeolocateControl has three interaction states: * active - the map's camera automatically updates as the user's location changes, keeping the location dot in the center. Initial state and upon clicking the GeolocateControl button. * passive - the user's location dot automatically updates, but the map's camera does not. Occurs upon the user initiating a map movement. * disabled - occurs if Geolocation is not available, disabled or denied.
Example
Use addGeolocateControls to set users location
JAVASCRIPT

const geolocate = olaMaps.addGeolocateControls({
  positionOptions: {
    enableHighAccuracy: true,
  },
  trackUserLocation: true,
})

myMap.addControl(geolocate)

Ola Maps | © OpenStreetMap contributors
Programmatically request and move the map to the user's location.
JAVASCRIPT

myMap.on('load', () => {
  geolocate.trigger()
})

Ola Maps | © OpenStreetMap contributors
Events
geolocate
This event is triggered when the user's location is successfully retrieved.
JAVASCRIPT

geolocate.on('geolocate', (event) => {
  console.log('A geolocate event has occurred')
})
error
This event is emitted when there is an error in retrieving the user's location.
JAVASCRIPT

geolocate.on('error', () => {
  console.log('An error event has occurred.')
})
trackuserlocationstart
Triggered when tracking of the user's location begins.
JAVASCRIPT

geolocate.on('trackuserlocationstart', () => {
  console.log('User location tracking has started.');
})
trackuserlocationend
Triggered when tracking of the user's location ends.
JAVASCRIPT

geolocate.on('trackuserlocationend', () => {
  console.log('User location tracking has ended.');
})
userlocationfocus
Triggered when the user's location gains focus, such as when a map is centered on it.
JAVASCRIPT

geolocate.on('userlocationfocus', () => {
  console.log('User location is focused on the map.');
})
userlocationlostfocus
Triggered when the user's location loses focus, such as when the map is panned away.
JAVASCRIPT

geolocate.on('userlocationlostfocus', () => {
  console.log('User location has lost focus on the map.');
})
outofmaxbounds
Triggered when the user's location is outside the defined maximum bounds.
JAVASCRIPT

geolocate.on('outofmaxbounds', () => {
  console.warn('User location is out of the maximum bounds.');
})

------------------------------------------------------------------------------------

Adding Ground Overlays in map
This documentation provides methods for creating a ground overlay on top of a map
Add ground overlays to map using addSource method and style it using addLayer’s paint properties.
JAVASCRIPT

myMap.on('load', () => {
  myMap.addSource([GROUND OVERLAY ID], {
    type: 'image',
    url: [IMAGE URL], // Replace with your image URL or base64
    coordinates: [
      [NW CORNER COORDINATES],
      [NE CORNER COORDINATES],
      [SE CORNER COORDINATES],
      [SW CORNER COORDINATES],
    ],
  })
  myMap.addLayer({
    id: 'overlay',
    type: 'raster',
    source: [GROUND OVERLAY ID],
    paint: {
      'raster-opacity': [ADD OPACITY], // from 0 to 1
    },
  })
})
Example
Taj Mahal Tourist Map Overlay

JAVASCRIPT

myMap.on('load', () => {
  myMap.addSource('ground-overlay', {
    type: 'image',
    url: [IMAGE URL], // Replace with your image URL or base64
    coordinates: [
      [78.039, 27.1781], // NW corner (Top-Left)
      [78.0452, 27.1781], // NE corner (Top-Right)
      [78.0452, 27.1721], // SE corner (Bottom-Right)
      [78.039, 27.1721], // SW corner (Bottom-Left)
    ],
  })
  myMap.addLayer({
    id: 'overlay',
    type: 'raster',
    source: 'ground-overlay',
    paint: {
      'raster-opacity': 0.75, // from 0 to 1
    },
  })
})