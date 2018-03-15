// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').load();
// }

const data = require('./allData.js');
const mongoose = require('mongoose');
const Photos = require('../database/index.js');
var faker = require('faker');
require('dotenv').load();
const API_KEY = process.env.API_KEY;
//mongoose.Promise = Promise;

const MAX_SEED = 2000;
const BATCH_SIZE = 5;
const MAX_PHOTOS = 10;
const MAX_REVIEWS = 10;
const PHOTOS_URL = 'https://picsum.photos/';

const startTime = Date.now(); //starting time of Seeding

let seedCounter = 0;

//generate a random number between two values inclusive
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

mongoose.connect('mongodb://localhost/photos', (err) => {
  if (err) {
    throw err;
  } else {
    console.log('mongoose connected');
  }
});


Photos.findOne(1,  (err,data)=>{
  //if at least one entry exits, drop database then seed data
  
  if(data[0] !== undefined){
    mongoose.connection.collections['photos'].drop( function(err) {
      console.log('DB has data, dropping collection...\nSeeding fresh DB...');
     // seed();
    });
  } else {
   // seed(); //immediately seed
  }
})

// async function seed(){

  let entries = [];
  let start = Date.now()
  function seedDatabase(){
    for (var seedNumber = 0; seedNumber < BATCH_SIZE; seedNumber++){
      const entry = {
        place_id: seedCounter,
        place_name: faker.company.companyName(),
        photos: [],
        reviews: [],
      };
      seedCounter++;
      //console.log(seedCounter);
      for (var i = 0; i < MAX_PHOTOS; i++){

        //generate random height, width, image
        const height = randomInt(400,600); 
        const width = randomInt(500,800);
        const imageId = randomInt(0,1000);

        const details = {
          url: `${PHOTOS_URL}${width}/${height}?image=${imageId}` ,
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

  let testdata = seedDatabase();

  let seedingDB = (entries) => {
    for (let i = 0; i < 20; i++) {
      let promise = new Promise ((resolve, reject) => {
        mongoose.insertMany(entries,(err, data) => {
          if (err) throw err;
          else {
            resolve(data);
          }
        })

      }).then(resolve => {
        console.log((Date.now() - start)/1000, `for ${resolve.length} insertions`)
      })
    }
  }

  seedingDB(testdata)
  
  // Photos.Model.create(entries, (err)=>{
  //   if (err){
  //     console.log('Error seeding MongoDB:', err);
  //   } else {
  //     let endTime = Date.now(); //End time of Seeding
  //     console.log('Success! MongoDB seeded with', MAX_BATCH, 'entries');
  //     console.log(`MongoDB seed Time was ${(endTime - startTime)/1000}s`);
  //     //mongoose.disconnect();
  //   }
  // })

 // await Photos.Model.insertMany(entries);
  // .then((err)=>{
  //   if (err){
  //     console.log('Error seeding MongoDB:', );
  //   } else {
  //     let endTime = Date.now(); //End time of Seeding
  //     console.log('Success! MongoDB seeded with', MAX_BATCH, 'entries');
  //     console.log(`MongoDB seed Time was ${(endTime - startTime)/1000}s`);
  //     //mongoose.disconnect();
  //   }
  // })
  // .then(()=>{
  //   console.log('I just inserted data');
  //   if (seedCounter >= MAX_SEED){

  //     let endTime = Date.now(); //End time of Seeding
  //     console.log('Success! MongoDB seeded with', MAX_SEED, 'entries');
  //     console.log(`MongoDB seed Time was ${(endTime - startTime)/1000}s`);

  //     mongoose.disconnect();
  //     process.exit(0);
  //   } else {
  //     seed();
  //   }

  // });
// }
// async function myfunc(){

//   for (var i =0; i<MAX_SEED; i++){
//     await seed();
//   }

//   let endTime = Date.now(); //End time of Seeding
//   console.log('Success! MongoDB seeded with', MAX_SEED*BATCH_SIZE, 'entries');
//   console.log(`MongoDB seed Time was ${(endTime - startTime)/1000}s`);

//   mongoose.disconnect();
//   process.exit(0);

// }

// myfunc();

