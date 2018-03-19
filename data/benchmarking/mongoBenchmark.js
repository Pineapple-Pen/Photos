const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'photos';


const randomInt = function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

const mongoConnect = async function mongoConnect(){
  let client;
  try {
    client = await MongoClient.connect(url);
    console.log('Native MongoDB driver connected to DB');

    let db = client.db(dbName);

    return db.collection('photos');

  } catch (err) {
    console.log(err.stack);
  }

}

const mongooseConnect = async function mongooseConnect(){

  await mongoose.connect('mongodb://localhost/photos');
  console.log('mongoose connected');
  
}

const photoSchema = mongoose.Schema({
  place_id: {
    type: Number,
    unique: true
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

  console.log('Queries with Mongoose');

  for (let i = 0; i < 10; i++){
    //Benchmarking Tests

    const start = Date.now();

    const result = await findOne(randomInt(9000000,9999999));

    const end = Date.now();

    console.log('Mongoose Query took', end - start, 'ms' );
    
  }

   mongoose.disconnect();

}





const executeNativeMongoDb = async function executeNativeMongoDb(collection){
  
  const findOneNative = async function findOneNative(id, collection) {
    return await collection.find({place_id: id}).limit(1).toArray();
  }

  console.log('Queries with MongoDB Native');

  for (let i = 0; i < 10; i++){
    //Benchmarking Tests

    const start = Date.now();

    const result = await findOneNative(randomInt(9000000,9999999), collection);

    const end = Date.now();
    console.log('Native MongoDB Query took', end - start, 'ms' );
  }

  process.exit();
}

const benchmark = async function benchmark (){

  await mongooseConnect();

  await findOneMongoose();

  const collection = await mongoConnect();

  await executeNativeMongoDb(collection);

}

benchmark();



