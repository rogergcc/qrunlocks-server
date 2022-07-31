
const db = require('../../app/config/db');

//const config = require('../config');
// `chat_id` VARCHAR(200) NOT NULL,
//   `email` VARCHAR(200) NULL,
//   `first_name` VARCHAR(200) NOT NULL,
//   `last_name` VARCHAR(200) NOT NULL,
//   `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
//   `updated_at`    DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  
async function create(user){
   const result = await db.query(
     `INSERT INTO user
     (chat_id, first_name, last_name) 
     VALUES 
     ('${user.chat_id}', '${user.first_name}', '${user.last_name}')`
   );
 
   let message = 'Error in creating user';
 
   if (result.affectedRows) {
     message = 'User created successfully';
   }
 
   return {message};
 }
 module.exports = {
   
   create
 }