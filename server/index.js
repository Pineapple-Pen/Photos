require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const redis = require("redis");
const client = redis.createClient();
const app = express();
const {promisify} = require('util'); //promisify redis
const getAsync = promisify(client.get).bind(client); //promisify get request on redis
const MongoClient = require('mongodb').MongoClient;
//const morgan = require('morgan');

const Photos = require('../database/index.js');

let connection;

async function connectMongo(){
  connection = await Photos.mongoConnect();
}

connectMongo(); //connect to mongoDB

client.on("connect",  (err) => {
    console.log("Redis is connected");
});

app.use(cors());
//app.use(morgan('tiny'));
app.use(bodyParser.json());

// serve static files from dist dir
app.use('/restaurants/:id', express.static(path.join(__dirname, '../client/dist')));
app.use('/', express.static(path.join(__dirname, '../client/dist')));

// if no ID typed into url bar, redirect to this ID
app.get('/', (req, res) => {
  res.status(200).redirect(`/restaurants/${Math.floor(Math.random()*10000000)}`);
});

//middleware that stores key/value pair for place in Redis cache on request
app.get('/api/restaurants/:id/gallery', async (req, res, next) => {
  

  const id = req.params.id;
  const data = await getAsync(id);

  if (data){
    res.send(data);
  } else {
    next();
  }

});

// retrieve data from API(db)
app.get('/api/restaurants/:id/gallery', async (req, res) => {

  const id = Number(req.params.id); //convert string URL to Numebr

  try {
    const data = await Photos.findOneNative(id, connection);
    client.setex(id, 3600, JSON.stringify(data), redis.print); // One hour caching for occasionally visited pages
    res.json(data);
  }

  catch(err){
    res.status(500).send(err);
  }

});

app.listen(3002, () => console.log('Gallery App listening on port 3002!'));

module.exports = app;
