const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');
const { csvToGeoJSON } = require('./utils/convert');

dotenv.config({ path: './config/.env' });

// Convert .csv to .geojson
const csv = fs.readFileSync(path.join(__dirname, './data/line1.csv'), 'utf-8');

const positions = csvToGeoJSON(csv);
const json = JSON.stringify(positions, null, 2);
fs.writeFileSync('data2.geojson', json);
// Initialize
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', (socket) => {
  console.log('A client connected');

  io.emit('positions', positions);

  // Runs when client disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected');

    // Program termination gracefully
    process.on('SIGINT', () => {
      clearInterval(updateInterval);
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  });
});

// Run server
const PORT = process.env.PORT || 3000;

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
