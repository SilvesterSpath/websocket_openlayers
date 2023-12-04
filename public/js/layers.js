window.onload = init;

const socket = io();

let datas = {};

socket.on('positions', (data) => {
  datas = data;
});

setTimeout(() => {
  console.log('data', datas);
}, 1000);

function init() {
  const map = new ol.Map({
    view: new ol.View({
      center: ol.proj.fromLonLat([20.73998593, 48.21339894]),
      zoom: 22,
      maxZoom: 30,
      minZoom: 4,
      rotation: 0,
    }),

    language: 'en',
    target: 'js-map',
  });

  // Base layers
  const openSteetMapStandard = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    title: 'OSMStandard',
  });

  const stamenTerrain = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}@2x.png',
      attributions:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>',
    }),
    visible: false,
    title: 'StamenTerrain',
  });

  const cyclOSM = new ol.layer.Tile({
    source: new ol.source.OSM({
      url: 'https://{a-c}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    }),
    visible: false,
    title: 'CyclOSM',
  });

  const openStreetMapHumanitarian = new ol.layer.Tile({
    source: new ol.source.OSM({
      url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      attributions: 'Humanitarian data © OpenStreetMap Contributors',
    }),
    visible: false,
    title: 'OSMHumanitarian',
  });

  // layer Group
  const baseLayerGroup = new ol.layer.Group({
    layers: [
      openSteetMapStandard,
      stamenTerrain,
      openStreetMapHumanitarian,
      cyclOSM,
    ],
  });

  map.addLayer(baseLayerGroup);

  // Layer Switcher Logic
  const baseLayerElements = document.querySelectorAll(
    'input',
    'baseLayerRadioButton'
  );

  baseLayerElements.forEach((baseLayer) => {
    console.log(baseLayer);
    baseLayer.addEventListener('change', function (e) {
      baseLayerGroup.getLayers().forEach((layer) => {
        if (layer.values_.title === this.value) {
          layer.setVisible(true);
        } else {
          layer.setVisible(false);
        }
      });
    });
  });

  // Vector Layers
  const EUCountries = new ol.layer.VectorImage({
    source: new ol.source.Vector({
      url: '../data/data2.geojson',
      format: new ol.format.GeoJSON(),
    }),
    visible: true,
    title: 'EUCountriesGeoJSON',
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.5)',
      }),
      stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1,
      }),
      image: new ol.style.Circle({
        radius: 5,
        fill: new ol.style.Fill({
          color: '#319FD3',
        }),
      }),
    }),
  });

  map.addLayer(EUCountries);

  // Vector Feature Popup Logic
  map.on('click', function (e) {
    console.log(e);
    map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
      console.log(feature.getKeys());
      let clicked = feature.get('geometry');
      console.log(clicked);
    });
  });
}
