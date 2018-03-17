const promise = require('bluebird'); // or any other Promise/A+ compatible library;
const faker = require('faker');
const { generatePlaceData } = require('./postgresHelpers');
const { generatePhotoData } = require('./postgresHelpers');
const { generateReviewerData } = require('./postgresHelpers');
const { MAX_PHOTOS } = require('./postgresHelpers');

require('dotenv').load();

const initOptions = {
  promiseLib: promise // overriding the default (ES6 Promise);
};

const postgres = require('pg-promise')(initOptions);

// Database connection details;
const connectionParams = {
  host: 'localhost', // 'localhost' is the default;
  port: 5432, // 5432 is the default;
  database: 'photos',
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD
};

const db = postgres(connectionParams); // database instance;

const NUM_BATCHES_PLACES = 100;
const NUM_BATCHES_REVIEWERS = 100;
const NUM_BATCHES_PHOTOS = 1000;

const BATCH_SIZE = 10000;
const BATCH_SIZE_PHOTOS = 1000;

const startTime = Date.now();

const insertPlaces = async function insertPlaces() {

  try {
    for (var i = 1; i <= NUM_BATCHES_PLACES; i++){
      const values = generatePlaceData(BATCH_SIZE);
      const cs = new postgres.helpers.ColumnSet(['place_name'], {table: 'places'});
      const query = postgres.helpers.insert(values, cs);
      
      await db.none(query);
      if (i*BATCH_SIZE % 100000 === 0) console.log(`Seeded ${i*BATCH_SIZE} places in ${Math.round((Date.now() - startTime)/1000)}s`);
    }
  }
  catch (error) {
      console.log('Error seeding data', error);
  }
  finally{
    const endTime = Date.now()
    console.log(`Places Seeding completed in ${Math.round((endTime - startTime)/1000)}s`);
    
  }
}

const insertPhotos = async function insertPhotos() {

  try {

    //needed to maintain counter of batches to set Place ID for each photoID
    let startBatchSize = 1;
    let endBatchSize = BATCH_SIZE_PHOTOS;

    for (var i = 1; i <= NUM_BATCHES_PHOTOS; i++){

      const values = generatePhotoData(startBatchSize, endBatchSize);
      const cs = new postgres.helpers.ColumnSet(['url', 'width', 'height', 'place_id', 'reviewer_id'], {table: 'photos'});
      const query = postgres.helpers.insert(values, cs);
      
      await db.none(query);
      if (i*BATCH_SIZE_PHOTOS*MAX_PHOTOS % 100000 === 0) console.log(`Seeded ${i*BATCH_SIZE_PHOTOS*MAX_PHOTOS} photos in ${Math.round((Date.now() - startTime)/1000)}s`);
      
      startBatchSize = endBatchSize + 1;
      endBatchSize += BATCH_SIZE_PHOTOS;
    }
  }
  catch (error) {
      console.log('Error seeding data', error);
  }
  finally{
    const endTime = Date.now();
    console.log(`Photo Seeding completed in ${Math.round((endTime - startTime)/1000)}s`);
 
  }
}

const insertReviewers = async function insertReviewers() {

  try {
    for (var i = 1; i <= NUM_BATCHES_REVIEWERS; i++){
      const values = generateReviewerData(BATCH_SIZE);
      const cs = new postgres.helpers.ColumnSet(['reviewer_name', 'reviewer_avatar'], {table: 'reviewers'});
      const query = postgres.helpers.insert(values, cs);
      
      await db.none(query);
      if (i*BATCH_SIZE % 100000 === 0) console.log(`Seeded ${i*BATCH_SIZE} reviewers in ${Math.round((Date.now() - startTime)/1000)}s`)
    }
  }
  catch (error) {
      console.log('Error seeding data', error);
  }
  finally{
    const endTime = Date.now()
    console.log(`Reviewer Seeding completed in ${Math.round((endTime - startTime)/1000)}s`)
   
  }
}

const seedDB = async function seedDB(){

  await insertPlaces();

  await insertReviewers();

  await insertPhotos();

  const endTime = Date.now()
  console.log(`Postgres Seeding completed in ${Math.round((endTime - startTime)/1000)}s`)
  db.$pool.end(); 
}

seedDB();






