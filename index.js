// to access the environment variables defined in .env file
require('dotenv').config();

// import express and cors into project
const express = require('express');
const cors = require('cors');

const server = express()
// port will look for process.env.PORT first if server cant find a PORT in .env, then use 5000 as backup
const port = process.env.PORT || 3000;

server.use(cors());
server.use(express.json());

// basic route
server.get('/', (req, res) => {
    res.send(`<h1>Server started on port ${port}</h1> <br> <h3>Version 1.1</h3>`);
});

// listener
server.listen(port, () => {
    console.log(`Server started and listening on port ${port}`);
});