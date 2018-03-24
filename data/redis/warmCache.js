const redis = require("redis");
const client = redis.createClient();
const {promisify} = require('util'); //promisify redis
const getAsync = promisify(client.get).bind(client); //promisify get request on redis
const MongoClient = require('mongodb').MongoClient;
const Photos = require('../../database/index.js');

async function connectMongo(){
  return await Photos.mongoConnect();
}

client.on("connect",  (err) => {
    console.log("Redis is connected");
});

const seedRedis = async function seedRedis(){

  let connection = await connectMongo(); //connect to mongoDB

    try {
      for(var id = 0; id < 100000; id++){
        const data = await Photos.findOneNative(id, connection);
        client.setex(id, 86400, JSON.stringify(data), redis.print); // 24 hour caching
      }
    }

    catch(err){
      console.log(err);
    }

    finally{
      process.exit();
    }
}

seedRedis();
