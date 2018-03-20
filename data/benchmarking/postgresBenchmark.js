const promise = require('bluebird'); // or any other Promise/A+ compatible library;
require('dotenv').load();
const { randomInt } = require('../postgres/postgresHelpers')

const initOptions = {
  promiseLib: promise // overriding the default (ES6 Promise);
};

const postgres = require('pg-promise')(initOptions);

const connectionParams = {
  host: 'localhost', // 'localhost' is the default;
  port: 5432, // 5432 is the default;
  database: 'photos',
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD
};

const db = postgres(connectionParams); // database instance;

const postgresQuery = async function postgresQuery(){


    try {
      let queryTimes = [];

      for (let i = 0; i < 2000; i++){
        const start = Date.now();
        const users = await db.any(`SELECT places.place_id, places.place_name, photos.url, photos.width, photos.height, reviewers.reviewer_name, reviewers.reviewer_avatar FROM places right outer join photos on places.place_id = photos.place_id inner join reviewers on reviewers.reviewer_id = photos.reviewer_id WHERE places.place_id = ${randomInt(0, 9999999)}`);
        const end = Date.now();
        queryTimes.push(end-start);
      }

      console.log(`PostgresDB: Completed 2000 Queries with an average time of ${queryTimes.reduce((accum, curr)=> accum + curr) / queryTimes.length}ms per query`);

      db.$pool.end(); 

    } 
    catch(e) {
        console.log('Oops! There was an error querying the database!');
    }
    

}

postgresQuery();