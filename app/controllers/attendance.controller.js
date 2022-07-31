const Attendance = require("../models/attendance.model.js");

// Create and Save a new User
module.exports.create = async (req,res) => {
  // Validate request
  //   if (!req.body) {
  //     res.status(400).send({
  //       message: "Content can not be empty!"
  //     });
  //   }

  // Create a User
  

 
  let response={}
  try {
  const attendance = new Attendance({
    chat_id: req.body.chat_id,
    event_id: req.body.event_id,
  });

   const userAlreadyAttendaceRegister = await Attendance.findByChatId(attendance.chat_id)
   if(userAlreadyAttendaceRegister.affectedRows){
      response.status = 200
      response.message = userAlreadyAttendaceRegister.message
      response.body = userAlreadyAttendaceRegister
      return res.status(response.status).send(response)
   }
   
    const responseRegisterUserAttendance = await Attendance.create(attendance)


    response.status = 200
    response.message = responseRegisterUserAttendance.message

    response.body = responseRegisterUserAttendance

   
    return res.status(response.status).send(response)
    // return res.send(response);
  } catch (error) {
    console.log("Something went wrong", error);
    response.message = error.message;
  }
  // return res.status(response.status).send(response)
};

exports.findAll = async (req, res) => {
  const title = req.query.title;

  Attendance.getAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    else res.send(data);
  });
};

// Find a single User by Id
exports.findOne = async (req, res) => {
  Attendance.findByChatId(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};
