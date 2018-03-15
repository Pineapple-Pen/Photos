const data = require('./allData.js');
const mongoose = require('mongoose');
const Photos = require('../database/index.js');
const faker = require('faker');
require('dotenv').load();

const MAX_SEED = 10000;
const BATCH_SIZE = 1000;
const MAX_PHOTOS = 8;
const PHOTOS_URL = 'https://picsum.photos/';

let seedCounter = 0;

//generate a random number between two values inclusive
const randomInt = function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

mongoose.connect('mongodb://localhost/photos', (err) => {
  if (err) {
    throw err;
  } else {
    console.log('mongoose connected');
  }
});

//if at least one entry exits, drop database then seed data
Photos.findOne(1, (err, data) => {

  if (data[0] !== undefined) {
    mongoose.connection.collections['photos'].drop(function(err) {
      console.log(`DB has data, dropping collection...\nSeeding fresh DB in batches of ${BATCH_SIZE}...`);
     // setTimeout(startSeedingDB, 2000);
    });
  } else {
    setTimeout(startSeedingDB, 2000);
  }
})

const startTime = Date.now(); //starting time of Seeding

const seed = async function seed(){

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

  await Photos.Model.insertMany(entries);
  if (seedCounter % BATCH_SIZE === 0) console.log(`Seeded ${seedCounter} rows in ${Math.round((Date.now() - startTime)/1000)}s`);

}

const startSeedingDB = async function startSeedingDB(){

  for (var i = 0; i < MAX_SEED; i++) {
    await seed();
  }

  let endTime = Date.now(); //End time of Seeding
  console.log('Success! MongoDB seeded with', MAX_SEED * BATCH_SIZE, 'entries');
  console.log(`MongoDB seed Time was ${(endTime - startTime)/1000}s`);

  mongoose.disconnect();
  process.exit(0);
}

// const array = [];
// for (var i = 0; i< MAX_SEED; i++){
//   array.push(null);
// }


// async function startSeedingDB(){

//   //for (var i = 0; i < MAX_SEED; i++) {
//     const promises = array.map(seed);
//     console.log('pushing a promise..')
//     await Promise.all(promises);

//     //await seed();
//   //}
//   // for (var i = 0; i < MAX_SEED; i++) {
//   //   //myArray.push(seed);
//   //   await Promise.all(promises);
//   // }

//   let endTime = Date.now(); //End time of Seeding
//   console.log('Success! MongoDB seeded with', MAX_SEED * BATCH_SIZE, 'entries');
//   console.log(`MongoDB seed Time was ${(endTime - startTime)/1000}s`);

//   mongoose.disconnect();
//   process.exit(0);
// }






