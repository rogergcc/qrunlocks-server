const Attendance = require("../models/attendance.model.js");
const User = require("../models/user.model.js");
const errorMappings = require('../middleware/errorMapping.js');
const { response } = require("express");


const handleErrorResponse = async (error) => {
  let response = {};
  let errorMessage = error.message
  let errorTypeCode =""

  for (const errorType in errorMappings) {
    if ( (error.message).includes(errorType)) {
      errorMessage = errorMappings[errorType].message;
      errorTypeCode = errorMappings[errorType].type;
      break;
    }
  }
  response.status = 500
  response.message = errorMessage
  response.error = errorTypeCode
  response.data= {}
  return response
}

// Create and Save a new User
module.exports.create = async (req, res) => {
  let response = {};
  try {
    // Validate request
    const requestBody = req.body;

    if (!requestBody || Object.keys(requestBody).length === 0) {
      response.status = 400;
      response.message = "Content can not be empty!";

      return res.status(response.status).send(response);
    }

    //#region Verificar el USUARIO EXISTEN EN EL SISTEMA -  esta registrado ?
    const userFounded = await User.findById(requestBody.chat_id);
    console.log('[atendance.controller] create() userFounded ? '+ JSON.stringify(userFounded))
  
    if (userFounded.affectedRows==false) {
      response.status=404
      response.error= "User Not Exists" 
      response.message= userFounded.message
      response.data = {}
      console.log("[attendance.Controller] response ?: " + JSON.stringify(response))
      // return response;
      return res.status(response.status).send(response);
    }

    //#endregion
    

    //#region REGION Verifica  EL USUARO YA REGISTRO SU ASISTENCIA CON SU QR Id
    const userRegisterAttendanceFounded = await Attendance.findByChatId(
      req.body.chat_id
    );
    if (userRegisterAttendanceFounded.affectedRows) {
      response.status = 409;
      response.error= "Attendance Conflict" 
      response.message = `The user [${req.body.chat_id}] already has attendance recorded this event`;
      response.data = userRegisterAttendanceFounded.findRows[0];
      return res.status(response.status).send(response);
    }
    //#endregion

    //REGISTRAR ASISTENCIA
    const attendance = new Attendance({
      chat_id: req.body.chat_id,
      event_id: req.body.event_id,
    })
    

    const responseRegisterUserAttendance = await Attendance.create(attendance);
    const userData= userFounded.findRows[0]
    if (responseRegisterUserAttendance.affectedRows) {
      response.error= "Attendance Conflict" 
      response.status = 409
      response.message= 'Error at register attendance in Event'
      response.data = userData  
      return res.status(response.status).send(response);
    }
    response.status = 201;
    response.message = `User [${userData.chat_id}] ${userData.last_name}, ${userData.first_name} register attendance successfully`;
    response.data = userData

    return res.status(response.status).send(response);

    // return res.send(response);
  } catch (error) {
    // console.log("Something went wrong at [atendance.controller] create(): [error]" +error)
    console.log("Something went wrong at [atendance.controller] create(): [error.message]: " +error.message)
    const response = await handleErrorResponse( error)
    return res.status(response.status).send(response);
  }
};


exports.findAll = async (req, res) => {
  let response = {};
  const title = req.query.title;
  try {
    const attendaceGetAll = await Attendance.getAll(title);

    response.status = 200;
    response.message = attendaceGetAll.message;
    response.body = attendaceGetAll;

    return res.status(response.status).send(response);
  } catch (error) {
    // console.log("[Attendace.controller]" +(error.message));
    response.status = 500
    response.message = error.message
    return res.status(response.status).send(response);
  }

  // Attendance.getAll(title, (err, data) => {
  //   if (err)
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving Attendance.",
  //     });
  //   else res.send(data);
  // });
};

// Find a single User by Id
exports.findOne = async (req, res) => {
  let response = {};
  try {
    const userAlreadyAttendaceRegister = await Attendance.findByChatId(
      req.params.id
    );
    if (userAlreadyAttendaceRegister.affectedRows) {
      response.status = 200;
    } else {
      response.status = 404;
    }

    response.message = userAlreadyAttendaceRegister.message;
    response.body = userAlreadyAttendaceRegister;

    return res.status(response.status).send(response);
  } catch (error) {
    response.status = 500;
    console.log("Something went wrong", error);
    response.message = error.message;
    return res.status(response.status).send('response');
  }

  // Attendance.findByChatId(req.params.id, (err, data) => {
  //   if (err) {
  //     if (err.kind === "not_found") {
  //       res.status(404).send({
  //         message: `Not found User with id ${req.params.id}.`,
  //       });
  //     } else {
  //       res.status(500).send({
  //         message: "Error retrieving User with id " + req.params.id,
  //       });
  //     }
  //   } else res.send(data);
  // });
};
