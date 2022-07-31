const sql = require("../../app/config/db");
const helper= require("./helper")
// constructor
class Attendance {
  constructor(attendance) {
    this.chat_id = attendance.chat_id;
    this.event_id = attendance.event_id;
  }
  static async create(newAttendance) {
   

    try {
      const result = await sql.query(
         `INSERT INTO attendance 
            (chat_id, event_id) 
            VALUES 
            ('${newAttendance.chat_id}', '${newAttendance.event_id}')`
       );
   
       let message = "Error at register attendance in Event"
       if (result.affectedRows) {
         message = "register attendance successfully";
       }
   
       return { result,message };
    } catch (error) {
      console.log("Something went wrong: created event", error);
      throw new Error(error);
    }
  }

  static async findByChatId(chat_id) {
   try {
      const result = await sql.query(
         `SELECT * FROM attendance WHERE chat_id = ${chat_id}`
       );
   
       let message = "Not found";
      
       let findRows=[]
       let affectedRows=false
       findRows = helper.emptyOrRows(result);
       
       if (findRows.length>0) {
         affectedRows=true
         message = "User already registered";
       }
   
       return { findRows,message,affectedRows };
    } catch (error) {
      console.log("Something went wrong", error);
      throw new Error(error);
    }

   

  }

  static getAll(title, result) {
    let query = "SELECT * FROM attendance";

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

module.exports = Attendance;
