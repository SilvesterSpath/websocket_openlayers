function csvToGeoJSON(csv) {
  // Parse CSV
  const lines = csv.split('\n');
  const headers = lines[0].split(',');
  const rows = lines.slice(1);

  // Create GeoJSON structure
  const geojson = {
    type: 'FeatureCollection',
    features: [],
  };

  // Process rows
  rows.forEach((row) => {
    const values = row.split(',');
    const lat = parseFloat(values[0]);
    const lon = parseFloat(values[1]);
    const heading = parseFloat(values[2]);

    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lon, lat, heading],
      },
    };

    geojson.features.push(feature);
  });

  return geojson;
}

// Usage:
const csv = `lat,lon,heading  
48.21339894,20.73998593,3.470315226
48.21340378,20.73998763,3.678493726`;

module.exports = { csvToGeoJSON };

const geojson = csvToGeoJSON(csv);

console.log(JSON.stringify(geojson, null, 2));
