const promise = require('bluebird'); // or any other Promise/A+ compatible library;
const faker = require('faker');
const { generatePlaceData } = require('./postgresHelpers');
const { Inserts } = require('./postgresHelpers');

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

const NUM_BATCHES = 100;
const BATCH_SIZE = 10000;

const startTime = Date.now();

const insertPlaces = async function insertPlaces() {

  try {
    for (var i = 1; i <= NUM_BATCHES; i++){
      const values = generatePlaceData(BATCH_SIZE);
      //const cs = new postgres.helpers.ColumnSet(['place_name'], {table: 'places'});
      const query = postgres.helpers.insert(values, ['place_name'], 'places');
      //console.log(query);
      await db.none(query);
      console.log(`Seeded ${i*BATCH_SIZE} places in ${Math.round((Date.now() - startTime)/1000)}s`)
    }
  }
  catch (error) {
      console.log('Error seeding data', error);
  }
  finally{
    const endTime = Date.now()
    console.log(`Postgres Seeding completed in ${Math.round((endTime - startTime)/1000)}s`)
    db.$pool.end(); 
  }
}


insertPlaces();







