document.querySelector(".info-btn").addEventListener("click", () => {
  infoHpprivconv.showModal();
});

function addDepartamentosLines(map, layerId = "departamentos_2022") {
  map.addSource(layerId, {
    type: "geojson",
    data: "./data/departamentos_2022.geojson",
    generateId: true,
  });

  map.addLayer({
    id: layerId + "_line",
    type: "line",
    source: layerId,
    layout: { visibility: "visible" }, // inicialmente oculta
    paint: {
      "line-color": "#1900ffff",
      "line-width": 2,
    },
  });
}

function mostrarDatos(e) {
  const datos = document.querySelector("#datos");

  const depto = document.querySelector("#dato-depto");
  const gobiernoLocal = document.querySelector("#dato-gobierno-local");
  const frac = document.querySelector("#dato-frac");
  const radio = document.querySelector("#dato-radio");
  const hpprivconv = document.querySelector("#dato-hpprivconv");
  const hprivconv = document.querySelector("#dato-hprivconv");
  const htotal = document.querySelector("#dato-htotal");

  hpprivconv.textContent = e.features[0].properties.hpprivconv;

  hprivconv.textContent = e.features[0].properties.hprivconve;

  htotal.textContent = e.features[0].properties.htotal;

  depto.textContent = e.features[0].properties.nomdepto;
  gobiernoLocal.textContent = e.features[0].properties.nommuni;
  frac.textContent = e.features[0].properties.frac;
  radio.textContent = e.features[0].properties.radio;
}

const beforeMap = new maplibregl.Map({
  container: "before", // container id
  style: {
    version: 8,
    sources: {
      argenmap: {
        type: "raster",
        scheme: "tms",
        tiles: [
          "https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
      },
    },
    layers: [
      {
        id: "imagery-tiles",
        type: "raster",
        source: "argenmap",
        minzoom: 1,
        maxzoom: 18,
      },
    ],
  },
  center: [-65.215, -26.915], // starting position [lng, lat]
  zoom: 8, // starting zoom
});

const afterMap = new maplibregl.Map({
  container: "after", // container id
  style: {
    version: 8,
    sources: {
      argenmap: {
        type: "raster",
        scheme: "tms",
        tiles: [
          "https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
      },
    },
    layers: [
      {
        id: "imagery-tiles",
        type: "raster",
        source: "argenmap",
        minzoom: 1,
        maxzoom: 18,
      },
    ],
  },
  center: [-65.215, -26.915], // starting position [lng, lat]
  zoom: 8, // starting zoom
});

const data = {};
let hoveredStateId = null;

//carga las capas
beforeMap.on("load", () => {
  beforeMap.addSource("ipmh_censo_2010", {
    type: "geojson",
    data: `./data/ipmh_censo_2001.geojson`,
    //genera id unico
    generateId: true,
  });

  beforeMap.addLayer({
    id: "ipmh_censo_2010",
    type: "fill",
    source: "ipmh_censo_2010",
    layout: {},
    paint: {
      "fill-color": [
        "step",
        ["get", "hpprivconv"],
        "#f1eef6", // 0–20
        20,
        "#d7b5d8", // 20–40
        40,
        "#df65b0", // 40–60
        60,
        "#dd1c77", // 60–80
        80,
        "#980043", // 80–100
      ],
    },
  });

  beforeMap.addLayer({
    id: "linea-ipmh_censo_2010",
    type: "line",
    source: "ipmh_censo_2010",
    layout: {},
    paint: {
      "line-color": "black",
      "line-width": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        3,
        0.5,
      ],
    },
  });

  // When a click event occurs on a feature in the states layer, open a popup at the
  // location of the click, with description HTML from its properties.
  beforeMap.on("click", "ipmh_censo_2010", (e) => {
    mostrarDatos(e);
  });

  // Change the cursor to a pointer when the mouse is over the states layer.
  beforeMap.on("mouseenter", "ipmh_censo_2010", () => {
    beforeMap.getCanvas().style.cursor = "pointer";
  });
  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  beforeMap.on("mousemove", "ipmh_censo_2010", (e) => {
    if (e.features.length > 0) {
      if (hoveredStateId) {
        beforeMap.setFeatureState(
          { source: "ipmh_censo_2010", id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = e.features[0].id;
      beforeMap.setFeatureState(
        { source: "ipmh_censo_2010", id: hoveredStateId },
        { hover: true }
      );
    }
  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  beforeMap.on("mouseleave", "ipmh_censo_2010", () => {
    if (hoveredStateId) {
      beforeMap.setFeatureState(
        { source: "ipmh_censo_2010", id: hoveredStateId },
        { hover: false }
      );
    }
    hoveredStateId = null;
  });
});

afterMap.on("load", () => {
  afterMap.addSource("ipmh_censo_2022", {
    type: "geojson",
    data: `./data/ipmh_censo_2022.geojson`,
    //genera id unico
    generateId: true,
  });

  afterMap.addLayer({
    id: "ipmh_censo_2022",
    type: "fill",
    source: "ipmh_censo_2022",
    layout: {},
    paint: {
      "fill-color": [
        "step",
        ["get", "hpprivconv"],
        "#f1eef6", // 0–20
        20,
        "#d7b5d8", // 20–40
        40,
        "#df65b0", // 40–60
        60,
        "#dd1c77", // 60–80
        80,
        "#980043", // 80–100
      ],
    },
  });

  afterMap.addLayer({
    id: "linea-ipmh_censo_2022",
    type: "line",
    source: "ipmh_censo_2022",
    layout: {},
    paint: {
      "line-color": "black",
      "line-width": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        3,
        0.5,
      ],
    },
  });

  // When a click event occurs on a feature in the states layer, open a popup at the
  // location of the click, with description HTML from its properties.
  afterMap.on("click", "ipmh_censo_2022", (e) => {
    mostrarDatos(e);
  });

  // Change the cursor to a pointer when the mouse is over the states layer.
  afterMap.on("mouseenter", "ipmh_censo_2022", () => {
    afterMap.getCanvas().style.cursor = "pointer";
  });

  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  afterMap.on("mousemove", "ipmh_censo_2022", (e) => {
    if (e.features.length > 0) {
      if (hoveredStateId) {
        afterMap.setFeatureState(
          { source: "ipmh_censo_2022", id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = e.features[0].id;
      afterMap.setFeatureState(
        { source: "ipmh_censo_2022", id: hoveredStateId },
        { hover: true }
      );
    }
  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  afterMap.on("mouseleave", "ipmh_censo_2022", () => {
    afterMap.getCanvas().style.cursor = "";

    if (hoveredStateId) {
      afterMap.setFeatureState(
        { source: "ipmh_censo_2022", id: hoveredStateId },
        { hover: false }
      );
    }
    hoveredStateId = null;
  });
});

// Agregar a ambos mapas
beforeMap.on("load", () => addDepartamentosLines(beforeMap));
afterMap.on("load", () => addDepartamentosLines(afterMap));

//container comparador
let container = "#comparison-container";

var map = new maplibregl.Compare(beforeMap, afterMap, container, {
  // mousemove: true,
  // orientation: "vertical",
});

//filtros
document.getElementById("filtros").addEventListener("change", (e) => {
  switch (e.target.id) {
    case "depto":
      depto = document.getElementById("depto-selector");
      operator = "==";
      e.target.checked ? (data.depto = depto.value) : delete data["depto"];
      console.log(data);
      break;
    case "muni":
      muni = document.getElementById("muni-selector");
      operator = "==";
      e.target.checked ? (data.codm = muni.value) : delete data["codm"];
      console.log(data);
      break;
    case "frac":
      frac = document.getElementById("frac-selector");
      operator = "==";
      e.target.checked ? (data.frac = frac.value) : delete data["frac"];
      console.log(data);
      break;
    case "radio":
      radio = document.getElementById("radio-selector");
      operator = "==";
      e.target.checked ? (data.radio = radio.value) : delete data["radio"];
      console.log(data);
      break;
    case "hpprivconv":
      operatorHpprivconv = document.getElementById("operator-hpprivconv");
      hpprivconv = document.getElementById("range-hpprivconv");
      operator = operatorHpprivconv.value;

      e.target.checked
        ? (data.hpprivconv = Number(hpprivconv.value))
        : delete data["hpprivconv"];

      break;

    case "htotal":
      operatorHtotal = document.getElementById("operator-htotal");
      htotal = document.getElementById("range-htotal");
      operator = operatorHtotal.value;

      e.target.checked
        ? (data.htotal = Number(htotal.value))
        : delete data["htotal"];

      break;
  }
  filterOnValue = Object.keys(data);

  mapLibreFilterSpread = [
    "all",
    ...filterOnValue.map((id) => [operator, id, data[id]]),
  ];
  mapLibreFilter = mapLibreFilterSpread;

  afterMap.setFilter("ipmh_censo_2022", mapLibreFilter);
  beforeMap.setFilter("ipmh_censo_2010", mapLibreFilter);
});
