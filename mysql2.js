// Setup MYSQL

const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE,
    debug    :  false
});

let databaseReady = false;

pool.query("SHOW DATABASES",(err, data) => {
    if(err) {
        console.error(err);
        return;
    }
    // rows fetch
    console.log(data);
    databaseReady = true;
});

const mysqlQuery = query => {
  return new Promise ((resolve, reject) => {
    pool.query(query,(err, data) => {
      if(err) {
          console.error(err);
          return reject(err);
      }
      // rows fetch
      //console.log(data);
      return resolve(data);
  });
  })
}