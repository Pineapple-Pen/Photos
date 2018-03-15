const data = require('./allData.js');
const MongoClient = require('mongodb').MongoClient;
const Photos = require('../database/index.js');
const faker = require('faker');

require('dotenv').load();

const MAX_SEED = 10000;
const BATCH_SIZE = 1000;
const MAX_PHOTOS = 8;
const PHOTOS_URL = 'https://picsum.photos/'; // Fake photos
const URL = 'mongodb://localhost'; // Connection URL
const DB_NAME = 'photos'; // Database Name

let seedCounter = 0;

//generate a random number between two values inclusive
const randomInt = function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

// Use connect method to connect to the server
MongoClient.connect(URL, function(err, client) {
  console.log("Connected successfully to MongoDB");

  const db = client.db(DB_NAME);

  const collection = db.collection('photos');

  collection.find({'place_id': 1}).toArray((err, docs)=> {
    if (docs[0] !== undefined){
      collection.drop((err, delOK)=> {
        if (err) throw err;
        if (delOK) {
          console.log(`DB has data, dropping collection...\nSeeding fresh DB in batches of ${BATCH_SIZE}...`);
          setTimeout(()=>startSeedingDB(collection, client), 2000);
        }
        
      });
    } else {
      setTimeout(()=>startSeedingDB(collection, client), 2000);
    }

  })
  //startSeedingDB(collection);
});

const startTime = Date.now(); //starting time of Seeding

const seed = async function seed(collection){

  let entries = [];

  function generateData() {
    for (var seedNumber = 0; seedNumber < BATCH_SIZE; seedNumber++) {
      const entry = {
        place_id: seedCounter,
        place_name: faker.company.companyName(),
        photos: [],
        reviews: [],
      };

      seedCounter++;

      for (var i = 0; i < MAX_PHOTOS; i++) {

        //generate random height, width, image
        const height = randomInt(400, 600);
        const width = randomInt(500, 800);
        const imageId = randomInt(0, 1000);

        const details = {
          url: `${PHOTOS_URL}${width}/${height}?image=${imageId}`,
          width: width,
          height: height,
        }

        const review = {
          name: faker.name.firstName() + " " + faker.name.lastName(),
          avatar: faker.internet.avatar(),
        }

        entry.reviews.push(review);
        entry.photos.push(details);
      }

      entries.push(entry);

    }
  }

  generateData();

  await collection.insertMany(entries);
  if (seedCounter % BATCH_SIZE === 0) console.log(`Seeded ${seedCounter} rows in ${Math.round((Date.now() - startTime)/1000)}s`);

}

const startSeedingDB = async function startSeedingDB(collection, connection){

  for (var i = 0; i < MAX_SEED; i++) {
    await seed(collection);
  }

  let endTime = Date.now(); //End time of Seeding
  console.log('Success! MongoDB seeded with', MAX_SEED * BATCH_SIZE, 'entries');
  console.log(`MongoDB seed Time was ${(endTime - startTime)/1000}s`);

  connection.close();
  process.exit();
}






