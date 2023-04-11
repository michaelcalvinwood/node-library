const { Pool } = require('node-postgres');
 
(async () => {
  const pool = new Pool({
    user: 'tester',
    host: '206.189.233.106',
    database: 'test',
    password: '',
    port: 5432
  });
  
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * from posts');
    console.log(res);
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
})().catch(console.error);