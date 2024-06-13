import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
const __dirname = dirname(fileURLToPath(import.meta.url));
const __basedir = resolve(__dirname, '..');

dotenv.configDotenv({ path: resolve(__basedir + '../../.env') });

const configs = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  dbName: process.env.DB_NAME,
  secretKey: process.env.SECRET_KEY,
  salt: process.env.SALT,
  jwtPubKey: process.env.JWT_PUB_KEY,
  jwtPvtKey: process.env.JWT_PVT_KEY,
  jwtAlg: process.env.JWT_ALG,
  mongoUrl: process.env.MONGO_URL,
  mongoDb: process.env.MONGO_DB,
  headerAllowOrigin: process.env.HEADERS_ORIGIN,
  headerFrameOptions: process.env.HEADERS_OPTIONS,
  headerContentOptions: process.env.HEADERS_CONTENT,
  headerXSS: process.env.HEADERS_XSS,
};

export default configs;
