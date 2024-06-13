import { MongoClient } from 'mongodb';
import configs from '@utils/config.js';

const client = new MongoClient(configs.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongod = async () => {
  try {
    const conn = await client.connect();
    return conn.db(configs.mongoDb);
  } catch (error) {
    console.log(`Mongo Error:\n${error}`);
    throw new Error(error);
  }
};

export default mongod;
