'use strict';

const express = require('express');
const path = require('path');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// root
app.get('/', (req, res) => {
  res.send('<img src="assets/images/lisa.gif" width="450" height="350" alt="lisa"/><br><a href="assets/html/hello.html"><h2>Hello?</h2></a>');
});

// static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);