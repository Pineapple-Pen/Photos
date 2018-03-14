// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').load();
// }

const data = require('./allData.js');
const mongoose = require('mongoose');
const Photos = require('../database/index.js');
var faker = require('faker');
require('dotenv').load();
const API_KEY = process.env.API_KEY;

const MAXSEED = 200;
const MAXPHOTOS = 10;
const MAXREVIEWS = 10;
const PHOTOS_URL = 'https://picsum.photos/';
const entries = [];
const startTime = Date.now(); //starting time of Seeding

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
      seed();
    });
  } else {
    seed(); //immediately seed
  }
})

function seed(){

  function seedDatabase(){
    for (var seedNumber = 0; seedNumber < MAXSEED; seedNumber++){
      const entry = {
        place_id: seedNumber,
        place_name: faker.company.companyName(),
        photos: [],
        reviews: [],
      };
      
      for (var i = 0; i < MAXPHOTOS; i++){

        //generate random height, width, image
        const height = randomInt(400,600); 
        const width = randomInt(500,800);
        const imageId = randomInt(0,1000);

        const details = {
          url: `${PHOTOS_URL}${width}/${height}?image=${imageId}` ,
          width: width,
          height: height,
        }
        entry.photos.push(details);
      }
      
      for (var i = 0; i < MAXPHOTOS; i++){
        const review = {
          name: faker.name.firstName() + " " + faker.name.lastName(),
          avatar: faker.internet.avatar(),
        }
        entry.reviews.push(review);
      }
      entries.push(entry);
    }
  }

  seedDatabase();

  Photos.insertAll(entries, (err)=>{
    if (err){
      console.log('Error seeding MongoDB:', err);
    } else {
      const endTime = Date.now(); //End time of Seeding
      console.log('Success! MongoDB seeded with', MAXSEED, 'entries');
      console.log(`MongoDB seed Time was ${(endTime - startTime)/1000}s`);
      mongoose.disconnect();
    }
  });

}
