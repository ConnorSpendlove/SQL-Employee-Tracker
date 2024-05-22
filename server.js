const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing application/json and urlencoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Middleware for front-end
app.use(express.static('public'));

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );