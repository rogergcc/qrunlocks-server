const connectionDb = require("../../app/config/db");
const helper = require("./helper");
// constructor

class Attendance {
  constructor(attendance) {
    this.chat_id = attendance.chat_id;
    this.event_id = attendance.event_id;
  }
  static async create(newAttendance) {
    try {
      const result = await connectionDb.query(
        `INSERT INTO attendance 
            (chat_id, event_id) 
            VALUES 
            ('${newAttendance.chat_id}', '${newAttendance.event_id}')`
      );

      let message = "Error at register attendance in Event";
      if (result.affectedRows) {
        message = "register attendance successfully";
      }

      return { result, message };
    } catch (error) {
      console.log("Something went wrong: created event", error);
      throw new Error(error);
    }
  }

  // Tutorial.create = (newTutorial, result) => {
  //   sql.query("INSERT INTO tutorials SET ?", newTutorial, (err, res) => {
  //     if (err) {
  //       console.log("error: ", err);
  //       result(err, null);
  //       return;
  //     }

  //     console.log("created tutorial: ", { id: res.insertId, ...newTutorial });
  //     result(null, { id: res.insertId, ...newTutorial });
  //   });
  // };

  static async findByChatId(chat_id) {
    try {
      const result = await connectionDb.query(
        `SELECT * FROM attendance WHERE chat_id = ${chat_id}`
      );

      let message = "";

      let findRows = [];
      let affectedRows = false;
      findRows = helper.emptyOrRows(result);

      if (findRows.length > 0) {
        affectedRows = true;
        message = "[Attendance] User found in Attendace Register";
      }
      else{
        affectedRows=false
        message= '[Attendance] User Not found in Attendace Register'
      }

      return { findRows, message, affectedRows };
    } catch (error) {
      console.log("[Attendance] Something went wrong", error);
      throw new Error(error);
    }
  }

  static async getAll(title) {
  
    let message = "";
    let findRows = [];
    let affectedRows = false;
    // if (title) {
    //   query += ` WHERE title LIKE '%${title}%'`;
    // }

    try {
      const query = "SELECT * FROM attendance";
      const result = await connectionDb.query(query);
      findRows = helper.emptyOrRows(result);

      if (findRows.length > 0) {
        message = "[Attendance] User Attendance already registered ";
      } else {
        message = "[Attendance] Use Attendance(S) Not founded";
      }

      return { findRows, message, affectedRows };
    } catch (error) {
      console.log("[Attendance] Something went wrong: get attendance: ", error.message);
      //saving logs error internally
      error.message= '[Attendance] Some error occurred while retrieving Attendance'
      // message = `Something happened when obtaining the attendee records : ${error.message}`
      throw new Error(error);
      // return { findRows, message, affectedRows };
    }
    

  }
}

module.exports = Attendance;
