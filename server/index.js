require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const morgan = require('morgan');

const Photos = require('../database/index.js');

let connection;

async function connectMongo(){
  connection = await Photos.mongoConnect();
}

connectMongo(); //connect to mongoDB

const app = express();
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

// serve static files from dist dir
app.use('/restaurants/:id', express.static(path.join(__dirname, '../client/dist')));

// if no ID typed into url bar, redirect to this ID
app.get('/', (req, res) => {
  res.status(200).redirect(`/restaurants/${Math.floor(Math.random()*10000000)}`);
});

// retrieve data from API(db)
app.get('/api/restaurants/:id/gallery', async (req, res) => {

  const id = Number(req.params.id); //convert string URL to Numebr

  try {
    const data = await Photos.findOneNative(id, connection);
    res.json(data);
  }

  catch(err){
    res.status(500).send(err);
  }

});

app.listen(3002, () => console.log('Gallery App listening on port 3002!'));

module.exports = app;
