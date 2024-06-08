/* eslint-disable no-undef */
import mysql from 'mysql';
import 'dotenv/config';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
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
