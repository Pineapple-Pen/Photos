const faker = require('faker');

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
  //console.log(placeData);
  return placeData;

}


module.exports.randomInt = randomInt;
module.exports.generatePlaceData = generatePlaceData;
