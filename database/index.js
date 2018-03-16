const mongoose = require('mongoose');

const PhotosSchema = mongoose.Schema({
  //ref: String,
  url: String,
  width: Number,
  height: Number,
});

const ReviewSchema = mongoose.Schema({
  name: String,
  avatar: String,
});

const photoSchema = mongoose.Schema({
  place_id: {
    type: Number,
    unique: true,
    index: true
  },
  place_name: String,
  photos: Array,
  reviews: Array,
 // photos: [PhotosSchema],
 // reviews: [ReviewSchema],
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

// insertOne will insert on entry into database
function insertOne(entry, callback) {
  Photos.create(entry, callback);
}

// insertAll will insert all entries into database
function insertAll(entries, callback) {
  Photos.create(entries, callback);
}


exports.findOne = findOne;
exports.findAll = findAll;
exports.insertOne = insertOne;
exports.insertAll = insertAll;
exports.isSeeded = isSeeded;
exports.Model = Photos;
