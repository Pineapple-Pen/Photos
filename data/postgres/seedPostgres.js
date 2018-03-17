const promise = require('bluebird'); // or any other Promise/A+ compatible library;
const faker = require('faker');
const { generatePlaceData } = require('./postgresHelpers');
const { generatePhotoData } = require('./postgresHelpers');
const { generateReviewerData } = require('./postgresHelpers');
const { MAX_PHOTOS } = require('./postgresHelpers');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

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

//divide batches across CPUs 

const NUM_BATCHES_PLACES = 1000 / numCPUs; 
const NUM_BATCHES_REVIEWERS = 100 / numCPUs;
const NUM_BATCHES_PHOTOS = 10000 / numCPUs;

const BATCH_SIZE_PLACES = 10000;
const BATCH_SIZE_REVIEWERS = 10000;
const BATCH_SIZE_PHOTOS = 1000;

const startTime = Date.now();

const insertPlaces = async function insertPlaces() {

  try {
    for (var i = 1; i <= NUM_BATCHES_PLACES; i++){
      const values = generatePlaceData(BATCH_SIZE_PLACES);
      const cs = new postgres.helpers.ColumnSet(['place_name'], {table: 'places'});
      const query = postgres.helpers.insert(values, cs);
      
      await db.none(query);
      if (i*BATCH_SIZE_PLACES % 100000 === 0) console.log(`Worker ${process.pid} seeded ${i*BATCH_SIZE_PLACES} places in ${Math.round((Date.now() - startTime)/1000)}s`);
    }
  }
  catch (error) {
      console.log('Error seeding data', error);
  }
  finally{

    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime)/1000);
    console.log(`Places Seeding completed in ${timeTaken}s\n`);
    return timeTaken;

  }
}

const insertPhotos = async function insertPhotos(workerId) {
  
  const BATCH_BASE = {
    1: 0,
    2: 2500000,
    3: 5000000,
    4: 7500000
  }

  try {
    console.log('yo zaid, this is my worker ID', workerId);
    //needed to maintain counter of batches to set Place ID for each photoID
    //Use workerId to select starting point for batches
    let startBatchSize = 1 + BATCH_BASE[workerId];
    let endBatchSize = BATCH_SIZE_PHOTOS + BATCH_BASE[workerId];

    for (var i = 1; i <= NUM_BATCHES_PHOTOS; i++){
      const values = generatePhotoData(startBatchSize, endBatchSize);
      const cs = new postgres.helpers.ColumnSet(['url', 'width', 'height', 'place_id', 'reviewer_id'], {table: 'photos'});
      const query = postgres.helpers.insert(values, cs);
      
      await db.none(query);
      if (i*BATCH_SIZE_PHOTOS*MAX_PHOTOS % 800000 === 0) console.log(`Worker ${process.pid} seeded ${i*BATCH_SIZE_PHOTOS*MAX_PHOTOS} photos in ${Math.round((Date.now() - startTime)/1000)}s`);
      
      startBatchSize = endBatchSize + 1;
      endBatchSize += BATCH_SIZE_PHOTOS;
    }
  }
  catch (error) {
      console.log('Error seeding data', error);
  }
  finally{

    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime)/1000);
    console.log(`Photo Seeding completed in ${timeTaken}s\n`);
    return timeTaken;

  }
}

const insertReviewers = async function insertReviewers() {

  try {
    for (var i = 1; i <= NUM_BATCHES_REVIEWERS; i++){
      const values = generateReviewerData(BATCH_SIZE_REVIEWERS);
      const cs = new postgres.helpers.ColumnSet(['reviewer_name', 'reviewer_avatar'], {table: 'reviewers'});
      const query = postgres.helpers.insert(values, cs);
      
      await db.none(query);
      if (i*BATCH_SIZE_REVIEWERS % 100000 === 0) console.log(`Worker ${process.pid} seeded ${i*BATCH_SIZE_REVIEWERS} reviewers in ${Math.round((Date.now() - startTime)/1000)}s`)
    }
  }
  catch (error) {
      console.log('Error seeding data', error);
  }
  finally{

    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime)/1000);
    console.log(`Reviewer Seeding completed in ${timeTaken}s\n`);
    return timeTaken;
   
  }
}

const seedDB = async function seedDB(workerId){

  //insert and capture times for each table

  const reviewersTimer = await insertReviewers();

  const placesTimer = await insertPlaces();

  const photosTimer = await insertPhotos(workerId);

  const endTime = Date.now();
  const timeTaken = Math.round((endTime - startTime)/1000);
  console.log(`\nSeeded ${NUM_BATCHES_PLACES*BATCH_SIZE_PLACES} Places in ${placesTimer}s\nSeeded ${NUM_BATCHES_REVIEWERS*BATCH_SIZE_REVIEWERS} Reviewers in ${reviewersTimer}s\nSeeded ${NUM_BATCHES_PHOTOS*BATCH_SIZE_PHOTOS*MAX_PHOTOS} Photos in ${photosTimer}s`);
  console.log(`Overall Postgres Seeding completed in ${timeTaken}s`);
  db.$pool.end(); 
  process.exit(); //end process for worker
}


if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  let deadWorkers = 0;

  cluster.on('exit', (worker, code, signal) => {
    deadWorkers++;
    console.log(`worker ${worker.process.pid} died`);
    
    //all workers terminated
    if (deadWorkers === numCPUs){
      console.log('Ending Master CPU instance');
      process.exit(); //end process for master CPU
    }

  });


} else {

  seedDB(cluster.worker.id); //invoke seed DB and pass worker id

}



