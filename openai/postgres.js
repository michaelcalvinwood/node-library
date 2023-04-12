require('dotenv').config();
const { Pool } = require('node-postgres');

const config = {
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432
};
const pool = new Pool(config);

let connectedFlag = false;

let pgClient;

const run = async () => {
  if (!connectedFlag) return;
  try {
        const res = await pgClient.query('SELECT * from posts');
        console.log(res);
      } catch (error) {
        console.log(error);
      }
}

// connect to postgres database
(async () => {
  pgClient = await pool.connect();
  try {
    // const res = await pgClient.query('SELECT * from posts');
    // console.log(res);
    connectedFlag = true;
  } catch (error) {
    console.log(error);
  } 
})().catch(console.error);

// give program 2 seconds to make the postgres connection and then run
setTimeout(run, 2000);

