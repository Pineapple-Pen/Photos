'use strict';

module.exports = {
  generateRandomData
};

function generateRandomData(userContext, events, done) {

  // generate random id between 0 - 100,000 representing most popular places
  const  idCached = Math.floor(Math.random()*100000);

  // generate random id between 0 - 10,0000,000 representing long tail of searches
  const  idNonCached = Math.floor(Math.random()*10000000);

  const randomValue = Math.random(); 

  // add variables to virtual user's context (90% probability to select a cached cvalue)
  userContext.vars.id = randomValue < 0.9 ? idCached : idNonCached;
  
  // continue with executing the scenario:
  return done();
}