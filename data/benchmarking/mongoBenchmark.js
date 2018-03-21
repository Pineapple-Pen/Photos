const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').load();

const DB_URL = process.env.DB_URL;

const url = `mongodb://${DB_URL}`;
const dbName = 'photos';


const randomInt = function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

const mongoConnect = async function mongoConnect(){
  let client;
  try {
    client = await MongoClient.connect(url);

    let db = client.db(dbName);

    return db.collection('photos'); //return connection object

  } catch (err) {
    console.log(err.stack);
  }

}

const mongooseConnect = async function mongooseConnect(){

  await mongoose.connect('mongodb://localhost/photos');

}

const photoSchema = mongoose.Schema({
  place_id: {
    type: Number,
    unique: true,
    index: true
  },
  place_name: String,
  photos: Array,
  reviews: Array,
});


const findOneMongoose = async function findOneMongoose(){

  const Photos = mongoose.model('Photos', photoSchema);

  const findOne = async function findOne(id) {
    return await Photos.find({place_id: id}).limit(1);
  }

  let queryTimes = [];
 
  for (let i = 0; i < 2000; i++){
    //Benchmarking Tests

    const start = Date.now();

    const result = await findOne(randomInt(0,9999999));

    const end = Date.now();

    queryTimes.push(end-start);
    
  }

  console.log(`\nMongoose: Completed ${queryTimes.length} queries in an average of ${queryTimes.reduce((accumulator, currentValue) => accumulator + currentValue) / queryTimes.length} ms per query\n` );

   mongoose.disconnect();

}





const executeNativeMongoDb = async function executeNativeMongoDb(collection){
  
  const findOneNative = async function findOneNative(id, collection) {
    return await collection.find({place_id: id}).limit(1).toArray();
  }

  let queryTimes = [];

  for (let i = 0; i < 2000; i++){
    //Benchmarking Tests

    const start = Date.now();

    const result = await findOneNative(randomInt(0,9999999), collection);

    const end = Date.now();

    queryTimes.push(end-start);

  }

  console.log(`MongoDB (Native Driver): Completed ${queryTimes.length} queries in an average of ${queryTimes.reduce((accumulator, currentValue) => accumulator + currentValue) / queryTimes.length} ms per query\n` );

  process.exit();
}

const benchmark = async function benchmark (){

  await mongooseConnect();

  await findOneMongoose();

  const collection = await mongoConnect();

  await executeNativeMongoDb(collection);

}

benchmark();

