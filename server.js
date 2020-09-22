// Setup empty JS object to act as endpoint for all routes
const projectData = {};

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require("body-parser");
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
app.listen(8000, () => {
  console.log(`running at http://localhost:8000`);
});

// Setup GET route
app.get("/dictionary", (req, res) => {
  res.send(projectData);
});

// Setup POST route
app.post("/add", (req, res) => {
  let data = req.body;
  projectData["temp"] = data.temp;
  projectData["feel"] = data.feel;
  projectData["date"] = data.date;
  projectData["temp_max"] = data.temp_max;
  projectData["temp_min"] = data.temp_min;
  projectData["type"] = data.type;
  projectData["name"] = data.name;
  res.send(projectData);
});
