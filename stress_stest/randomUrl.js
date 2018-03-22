'use strict';

module.exports = {
  generateRandomData
};


function generateRandomData(userContext, events, done) {
  // generate random id
  const  id = Math.floor(Math.random()*10000000);
  // add variables to virtual user's context:
  userContext.vars.id = id;
  // continue with executing the scenario:
  return done();
}