/* 
Client side gets data from the server and uses mapBox to display the data on a map
*/

// MAP SETUP
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2hlemFkaGFzc2FuIiwiYSI6ImNrcXdjeDJtbzBrYmgydXFoMHMwY3pmdHgifQ.PwSdUXOY1kbbfM_KakClng";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [47.50806, 34.627971],
  zoom: 2,
});

//Getting data

let Name = document.getElementById("Name");
let Model = document.getElementById("Model");
let Process = document.getElementById("Process");
let Capacity = document.getElementById("Capacity");
let GridConnectionDate = document.getElementById("GridConnectionDate");
let LoadFactor = document.getElementById("LoadFactor");

async function getReactors() {
  const res = await axios({
    method: "get",
    url: "http://localhost:4000/",
  });

  const reactors = res.data.map((reactor) => {
    return {
      type: "Feature",
      properties: {
        Name: reactor.Name,
        Model: reactor.Model,
        Process: reactor.Process,
        Capacity: reactor.Capacity,
        GridConnectionDate: reactor.GridConnectionDate,
        LoadFactor: reactor.LoadFactor,
      },
      geometry: {
        type: "Point",
        coordinates: [
          reactor.location.coordinates[0],
          reactor.location.coordinates[1],
        ],
      },
    };
  });

  //console.log(reactors[0]);
  loadMap(reactors);
}

function loadMap(reactors) {
  map.on("load", function () {
    map.addSource("reactors", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: reactors,
      },
      generateId: true,
    });

    map.addLayer({
      id: "reactors-viz",
      type: "circle",
      source: "reactors",
      paint: {
        "circle-radius": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          [
            "interpolate",
            ["linear"],
            ["get", "Capacity"],
            300,
            8,
            500,
            10,
            1000,
            14,
            1300,
            18,
          ],
          5,
        ],
        "circle-stroke-color": "#000",
        "circle-stroke-width": 1,
        "circle-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          [
            "interpolate",
            ["linear"],
            ["get", "Capacity"],
            300,
            "yellow",
            500,
            "orange",
            1000,
            "red",
            1300,
            "green",
          ],
          "black",
        ],
      },
    });

    //Hover effect
    var reactorID = null;

    map.on("mousemove", "reactors-viz", (e) => {
      map.getCanvas().style.cursor = "pointer";
      // Set variables equal to the current feature's magnitude, location, and time
      var reactorName = e.features[0].properties.Name;
      var reactorModel = e.features[0].properties.Model;
      var reactorProcess = e.features[0].properties.Process;
      var reactorCapacity = e.features[0].properties.Capacity + "MWe";
      var reactorDate = e.features[0].properties.GridConnectionDate;
      var reactorLoadFactor = e.features[0].properties.LoadFactor + "%";

      // Check whether features exist
      if (e.features.length > 0) {
        // Display the magnitude, location, and time in the sidebar
        Name.textContent = reactorName;
        Model.textContent = reactorModel;
        Process.textContent = reactorProcess;
        Capacity.textContent = reactorCapacity;
        GridConnectionDate.textContent = reactorDate;
        LoadFactor.textContent = reactorLoadFactor;

        // If quakeID for the hovered feature is not null,
        // use removeFeatureState to reset to the default behavior
        if (reactorID >= 0) {
          map.removeFeatureState({
            source: "reactors",
            id: reactorID,
          });
        }

        reactorID = e.features[0].id;

        // When the mouse moves over the earthquakes-viz layer, update the
        // feature state for the feature under the mouse
        map.setFeatureState(
          {
            source: "reactors",
            id: reactorID,
          },
          {
            hover: true,
          }
        );
      }
    });

    map.on("mouseleave", "reactors-viz", function () {
      if (reactorID >= 0) {
        map.setFeatureState(
          {
            source: "reactors",
            id: reactorID,
          },
          {
            hover: false,
          }
        );
      }

      reactorID = null;
      // Remove the information from the previously hovered feature from the sidebar
      Name.textContent = "";
      Model.textContent = "";
      Process.textContent = "";
      Capacity.textContent = "";
      GridConnectionDate.textContent = "";
      LoadFactor.textContent = "";

      // Reset the cursor style
      map.getCanvas().style.cursor = "";
    });
  });
}

getReactors();
