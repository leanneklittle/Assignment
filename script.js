// Define Map 
var mymap = L.map('mapid').setView([52.403234, 0.0183248], 9)

// CartoDB Voyager
var CartoDB = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(mymap);

// Open Street Map
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 3
	}).addTo(mymap);

baseLayers = {"Open Street Map": osmLayer, "CartoDB Light": CartoDB};

// Map Control
L.control.layers(baseLayers).addTo(mymap);

// Make an XMLHttpRequest to the JSON data
var request = new XMLHttpRequest();
request.open('GET', '', true);

request.onload = function () {
  // begin accessing JSON data here
  var data = JSON.parse(this.response);

  // Reduce neighborhoods down to how many they are, and count them
  var neighborhoodCount = data.cafes.reduce((sums, cafe) => {
    sums[cafe.neighborhood] = (sums[cafe.neighborhood] || 0) + 1;
    return sums;
  }, {});

  // Create a sidebar
  var sidebar = document.getElementById('neighborhoods');
  var h3 = document.createElement("h3");
  h3.innerHTML = "Neighborhood Count";
  sidebar.appendChild(h3);

  // Print all neighborhoods in sidebar
  for (let neighborhood in neighborhoodCount) {
    const p = document.createElement("p");
    p.innerHTML = `<b>${neighborhood}</b> : ${neighborhoodCount[neighborhood]}`;
    sidebar.appendChild(p);
  }

  // Print cafe markers
  var cafes = data.cafes.map(cafe => {
    console.log(cafe.name);

    L.marker([cafe.lat, cafe.long], {
      icon: coffeeCup
    }).bindPopup(`
        <h2>${cafe.name}</h2>
        <p><b>Neighborhood:</b> ${cafe.neighborhood}</p>
        <p><b>Ambiance:</b> ${cafe.ambiance}</p>
        <p><b>Flavor:</b> ${cafe.flavor}</p>
        <p><b>Comments:</b> ${cafe.comments}</p>
    `).openPopup().addTo(mymapmap);
  });
}

request.send();