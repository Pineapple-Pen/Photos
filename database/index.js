const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').load();
const DB_URL = process.env.DB_URL || 'localhost';

const url = `mongodb://${DB_URL}`;
const dbName = 'photos';

const mongoConnect = async function mongoConnect(cb,id){
  let client;

  try {

    client = await MongoClient.connect(url);

    let db = client.db(dbName);

    console.log('MongoDB is connected');

    connection = db.collection('photos');

    return connection;

  } 
  catch (err) {
    console.log(err.stack);
  }

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



const Photos = mongoose.model('Photos', photoSchema);

// check if database is already seeded;
function isSeeded() {
  return Photos.count();
}

// findAll retrieves all stories
function findAll(callback) {
  Photos.find({}, callback);
}

// findOne will retrieve the photo associated with the given id
function findOne(id, callback) {
  Photos.find({
    place_id: id,
  }, callback).limit(1);
}

// findOne using native node.js MongoDB driver
const findOneNative = async function findOneNative(id, connection) {
   return await connection.find({place_id: id}).limit(1).toArray();
}

// insertOne will insert on entry into database
function insertOne(entry, callback) {
  Photos.create(entry, callback);
}

// insertAll will insert all entries into database
function insertAll(entries, callback) {
  Photos.create(entries, callback);
}


exports.mongoConnect = mongoConnect;
exports.findOne = findOne;
exports.findOneNative = findOneNative;
exports.findAll = findAll;
exports.insertOne = insertOne;
exports.insertAll = insertAll;
exports.isSeeded = isSeeded;
exports.Model = Photos;
