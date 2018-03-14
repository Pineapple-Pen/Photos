const data = require('./allData.js');
const mongoose = require('mongoose');
const Photos = require('../database/index.js');
require('dotenv').load();
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').load();
// }
const API_KEY = process.env.API_KEY;

mongoose.connect('mongodb://localhost/photos', (err) => {
  if (err) {
    throw err;
  } else {
    console.log('mongoose connected');
  }
});

function seedDb() {
  let count = 0;
  Photos.isSeeded().then((result) => {
    if (result === 0) {
      data.forEach((place) => { // for each ID
        const entry = {
          place_id: place.result.place_id,
          place_name: place.result.name,
          photos: [],
          reviews: [],
        };
        // push photo details to entry
        const photos = place.result.photos;
        const PHOTOS_URL = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=900&photoreference=';

        for (let i = 0; i < photos.length; i += 1) {
          const photoRef = photos[i].photo_reference;
          const photoUrl = `${PHOTOS_URL}${photoRef}&key=${API_KEY}`;
          const details = {
            ref: photoRef,
            url: photoUrl,
            width: photos[i].width,
            height: photos[i].height,
          };
          entry.photos.push(details);
        }

        // push each review to entry
        const reviews = place.result.reviews;

        for (let j = 0; j < reviews.length; j += 1) {
          const review = {
            name: reviews[j].author_name,
            avatar: reviews[j].profile_photo_url,
          };
          entry.reviews.push(review);
        }

        Photos.insertOne(entry, (err) => {
          if (err) {
            console.log(err);
          } else {
            count += 1;
            if (count === 195) {
              console.log('database successfully seeded');
              mongoose.disconnect();
            }
          }
        });
      });
    } else {
      console.log('database is already seeded');
      mongoose.disconnect();
    }
  });
}

seedDb(data);


module.exports = seedDb;
