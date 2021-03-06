const sql = require("../../app/config/db");
const helper= require("./helper")
// constructor
class User {
  constructor(user) {
    this.chat_id = user.chat_id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.status = user.status;
  }
  static async create(newUser) {
   

    try {
      const result = await sql.query(
         `INSERT INTO user 
            (chat_id, first_name, last_name) 
            VALUES 
            ('${newUser.chat_id}', '${newUser.first_name}', '${newUser.last_name}')`
       );
   
       let message = "Error in creating user"

       

       if (result.affectedRows) {
         message = "user created successfully";
       }
   
       return { result,message };
    } catch (error) {
      console.log("Something went wrong: created user", error);
      throw new Error(error);
    }
  }

  static async findById(chat_id) {
   try {
      const result = await sql.query(
         `SELECT * FROM user WHERE chat_id = ${chat_id}`
       );
   
       let message = "Not found";
      
       let findRows=[]
       let affectedRows=false
       findRows = helper.emptyOrRows(result);
       
       if (findRows.length>0) {
         affectedRows=true
         message = "User already registered ";
       }
   
       return { findRows,message,affectedRows };
    } catch (error) {
      console.log("Something went wrong: find user", error);
      throw new Error(error);
    }

   

  }

  static getAll(title, result) {
    let query = "SELECT * FROM users";

    if (title) {
      query += ` WHERE title LIKE '%${title}%'`;
    }

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("users: ", res);
      result(null, res);
    });
  }
}

module.exports = User;
