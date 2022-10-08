const mysql = require('mysql2/promise')
const config = require('./config')

async function query(sql, params) {
  

  const connection = await mysql.createConnection(
   {
      host: config.HOST,
      user: config.USER,
      password: config.PASSWORD,
      database: config.DB,
      // ssl : {
      //   rejectUnauthorized: false
      // }
    }
  );
  connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
  });
  
  const [results, ] = await connection.execute(sql, params);

  return results;
}

module.exports = {
  query
}

// const mysql = require('mysql2/promise')
// const config = require("./config");
// // Create a connection to the database

// const connectionDb = async () => {
//   const connection = await mysql.createConnection({
//     host: config.HOST,
//     user: config.USER,
//     password: '',
//     database: config.DB,
//           // ssl : {
//           //     rejectUnauthorized: true
//           //   }
//   });

//   // open the MySQL connection
//   connection.connect((error) => {
//     if (error) throw error;
//     console.log("Successfully connected to the database.");
//   });

//   return connection
// };

// module.exports = {
//   connectionDb
// };

