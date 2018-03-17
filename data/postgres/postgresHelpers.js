const faker = require('faker');

const MAX_PHOTOS = 8;

//generate a random number between two values inclusive
const randomInt = function randomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

const PHOTOS_URL = 'https://picsum.photos/'; // Fake photos

const generatePlaceData = function generatePlaceData(batchSize){
  
  let placeData = [];

  for (let i = 0; i < batchSize; i++){
    placeData.push({place_name: faker.company.companyName()});
  }
  
  return placeData;

}

const generatePhotoData = function generatePhotoData(startSize, endSize){
  
  let photoData = [];

  for (let placeId = startSize; placeId <= endSize; placeId++){
    for (let i = 0; i < MAX_PHOTOS; i++){
     
      //generate random height, width, image & reviewer ID
      const height = randomInt(400, 600);
      const width = randomInt(500, 800);
      const imageId = randomInt(0, 1000);
      const reviewerId = randomInt(1, 1000000);

      photoData.push({
        url: `${PHOTOS_URL}${width}/${height}?image=${imageId}`, 
        width: width, 
        height: height,
        place_id: placeId,
        reviewer_id: reviewerId
      });

    }

  }
  
  return photoData;

}

const generateReviewerData = function generateReviewerData(batchSize){
  
  let reviewerData = [];

  for (let i = 0; i < batchSize; i++){

    //generate random height, width, image
    const reviewerName = faker.name.firstName() + " " + faker.name.lastName()
    const reviewerAvatar = faker.internet.avatar()
    reviewerData.push({reviewer_name: reviewerName , reviewer_avatar: reviewerAvatar });
  }
  
  return reviewerData;

}

module.exports.randomInt = randomInt;
module.exports.generatePlaceData = generatePlaceData;
module.exports.generatePhotoData = generatePhotoData;
module.exports.generateReviewerData = generateReviewerData;
module.exports.MAX_PHOTOS = MAX_PHOTOS;

