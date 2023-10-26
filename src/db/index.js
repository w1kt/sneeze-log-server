import { Pool } from 'pg';

const pool = new Pool(
  {
    connectionString: process.env.DATABASE_URL,
  }
) // See .env file for connection settings

export default {
  query(text, params) {
    return new Promise((resolve, reject) => {
      pool.query(text, params)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        })
    })
  }
}