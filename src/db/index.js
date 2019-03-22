import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool(({
  database: "reflection_db"  
}))

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