const connectionDb = require("../../app/config/db");
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
      const result = await connectionDb.query(
         `INSERT INTO user 
            (chat_id, first_name, last_name) 
            VALUES 
            ('${newUser.chat_id}', '${newUser.first_name}', '${newUser.last_name}')`
       );
   
       let message = "";

       if (result.affectedRows) {
         message = "user created successfully";
       } else {
         message = "Error in creating user";
       }
   
       return { result,message };
    } catch (error) {
      console.log("Something went wrong: created user", error);
      throw new Error(error);
    }
  }

  static async findById(chat_id) {
    let findRows=[]
    let affectedRows=false
    let message = ""
   try {
     console.log('[user.model] findById INIT')
     var chatId = (chat_id+"").trim()
      const query = `SELECT * FROM user WHERE chat_id = '${chatId}'`
      console.log('query :'+ query);
      const result = await connectionDb.query(query)

      console.log('result')
      console.log(result)
      
      
       findRows = helper.emptyOrRows(result);
       if( chatId==""){
         affectedRows=false
         message="Id No giving"
         return { findRows,message,affectedRows } 
       }
       if (findRows.length>0) {
         affectedRows=true
         message = "User Founded"
         return { findRows,message,affectedRows } 
       }
       else{
         affectedRows=false
         message = `User [${chatId}] not Found`
         return { findRows,message,affectedRows } 
       }
    } catch (error) {
      
      console.log("[user.model] findById() Something went wrong finding user: "+ error.message);
      message = `Something ocurre finding user: ${error.message}`
      throw new Error(error);
      // return { findRows, message,affectedRows }
    }
  }

  static async getAll(title) {
    
    try {
      let query = "SELECT *FROM user WHERE status=1";

      if (title) {
        query = query+` and chat_id LIKE '%${title}%' `;
      }
      const result = await connectionDb.query(query)
   
       let message = "Users Not found";
      
       let findRows=[]
       let affectedRows=false
       findRows = helper.emptyOrRows(result);
       
       if (findRows.length>0) {
         affectedRows=true
         message = "get ";
       }
   
       return { findRows,message,affectedRows };
    } catch (error) {
      console.log("Something went wrong: find user", error);
      throw new Error(error);
    }

  }
}

module.exports = User;
