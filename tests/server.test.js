const request = require('supertest');
const server = require('../server/index.js');
const db = require('../database/index.js');
const testData = require('./test_data.js');

describe('Test the root path with GET', () =>
  test('it should respond to the GET request', () =>
    request(server).get('/api/restaurants/:id/gallery').then(response =>
      expect(response.statusCode).toBe(200))));


describe('Test non-existent endpoint with POST', () =>
  test('it should respond to invalid POST request with 404', () =>
    request(server).post('/gobbledidook').then(response =>
      expect(response.statusCode).toBe(404))));


describe('Test Database', () => {
  test('it should insert records into database', () => {
    db.insertOne(testData[0], (err) => {
      if (err) {
        console.log('error:', err);
      } else {
        console.log(testData);
        db.findOne('1234', (error, result) => {
          if (err) {
            console.log(error);
          } else {
            console.log('RESULT: ',result);
            expect(result.place_name).toBe('Some Place');
          }
        });
      }
    });
  });
});
