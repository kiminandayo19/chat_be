import mysql from 'mysql';
import configs from '@utils/config.js';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: configs.dbHost,
  user: configs.dbUser,
  password: configs.dbPass,
  database: configs.dbName,
});

const execQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(new Error(err));
        return;
      }
      connection.query(query, params, (err, res) => {
        connection.release();
        if (err) {
          reject(new Error(err));
          return;
        }
        resolve(res);
      });
    });
  });
};

export default execQuery;
