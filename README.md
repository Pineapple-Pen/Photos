# Pen Apple Pineapple Pen
Photo Gallery component of Zagat.com. This project is taking an implemented client-side photo gallery and optimizing its backend (server & datastorage infrastructure) to support highly scalable use, targeting a minimum of 100 req/ s.

## Related Projects

  - https://github.com/bamboo-connection/recommendations
  - https://github.com/bamboo-connection/overview
  - https://github.com/bamboo-connection/map-side-bar

## Table of Contents

1. [Purpose](#purpose)
1. [Database](#database)
1. [Prerequisites](#prerequisites)
1. [APIKey](#GoogleAPIKey)
1. [Installation](#Installation)
1. [Tests](#tests)

#Purpose
This service forms a part of the WeGot food review website. It renders 6 recommended restaurants based on proximity to the current restaurant selected showing basic information about a restaurant, including the name, description, type, neighborhood, price level, WeGot and Google reviews summary. Clicking on the restaurant will take you to the newly selected restaurant page.

#Database
A MongoDB database that holds restaurant information.

#Prerequisites
-npm -node -jest -webpack -MongoDB

#APIKey
To seed the database for the application, you will need a Google API key.

You can get an API Key from Google here: https://developers.google.com/maps/documentation/javascript/get-api-key

Duplicate config.example.js and rename it to config.js. Replace the placeholder strings in your newly created config.js with your Google API key.

NOTE: You've now created the file referenced in seed.js as config.js that your app requires in order to seed the database.

#Installation
1. Install dependencies: `-npm install`
2. Start database server: `-npm run database`
3. Seed database: `-npm run seed-database`
4. Run React Webpack: `-npm run react-dev`,
5. Start server: `-npm server`

To start, in your browser navigate to: http://localhost:3001

#Tests
Run: `npm run test`

#Credit
Credit to team 'WeGot' for the initial front-end component implementation of the Photo Gallery