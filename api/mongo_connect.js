const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI || 'mongodb+srv://lh571790:luiz2009@cluster0.rdekdar.mongodb.net/desculpe-fashion?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
let dbInstance = null;

async function connect() {
  if (!dbInstance) {
    await client.connect();
    const dbName = process.env.DB_NAME || 'desculpe-fashion';
    dbInstance = client.db(dbName);
    console.log('Connected to MongoDB:', dbName);
  }
  return dbInstance;
}

module.exports = { connect, client };
