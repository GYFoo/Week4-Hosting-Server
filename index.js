const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
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

/////////////////////////////////////////
// JUST TO TEST RETRIEVING FROM DATABASE
/////////////////////////////////////////
server.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.send(results.results);
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

// to post data to the database table
server.post('/db', async (req, res, next) => {
  try {
    let id = req.body.id;
    let name = req.body.name;
    const newInsert = await pool.query("INSERT INTO test_table (id, name) VALUES ($1, $2) RETURNING *", [id, name]);
    res.json(newInsert);
  }
  catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});
/////////////////////////////////////////////////////
// END OF ENDPOINTS TO TEST RETRIEVING FROM DATABASE
/////////////////////////////////////////////////////

//////////////////////////////////////
// TO GET ALL USERS FROM THE DATABASE
//////////////////////////////////////
server.get('/users', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM user_table');
      const results = { 'results': (result) ? result.rows : null};
      res.send(results.results);
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });
  
  // to post new user to the database table
  server.post('/users', async (req, res, next) => {
    try {
      let username = req.body.username;
      let age = req.body.age;
      const newInsert = await pool.query("INSERT INTO user_table (username, age) VALUES ($1, $2) RETURNING *", [username, age]);
      res.json(newInsert);
    }
    catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });
  
  // to get user based on username
  server.get('/users/:username', async (req, res) => {
    try {
      let username = req.params.username;
      const userResult = await pool.query("SELECT * FROM user_table WHERE username = $1", [username]);
      const userResults = { 'results': (userResult) ? userResult.rows : null};
      res.send(userResults.results[0]);
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });
  ////////////////////////////////////////
  // END OF ENDPOINTS FOR THE USERS TABLE
  ////////////////////////////////////////

// listener
server.listen(port, () => {
    console.log(`Server started and listening on port ${port}`);
});