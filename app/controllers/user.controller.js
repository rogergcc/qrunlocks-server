const User = require("../models/user.model.js");


// const getLanguages = async (req, res) => {
//   try {
//       const connection = await getConnection();
//       const result = await connection.query("SELECT id, name, programmers FROM language");
//       res.json(result);
//   } catch (error) {
//       res.status(500);
//       res.send(error.message);
//   }
// };

// Create and Save a new User ONLY PAYLORD WORING FROM CHATBOT TELEGRAM
module.exports.create = async (req) => {
  // Validate request
  //   if (!req.body) {
  //     res.status(400).send({
  //       message: "Content can not be empty!"
  //     });
  //   }

 
  let response={}
  try {
    
    console.log("Request data:");
    console.log(req);

   const userExists = await User.findById(req.chat_id)
   if(userExists.affectedRows){
      response.status = 200
      response.message = `User [${req.chat_id}] ${req.first_name} already registered`
  
      response.body = userExists
      console.log('=>Controller userExists'+ JSON.stringify(userExists))
      return response
   }
   
   
    // Create a User
    
    const newUser = new User({
      chat_id: req.chat_id,
      first_name: req.first_name,
      last_name: req.last_name,
      status: "1",
    });

    console.log('=>Controller newUser'+ JSON.stringify(newUser))
    
    const responseCreateUser = await User.create(newUser)
    // console.log('=>Controller responseCreateUser'+ JSON.stringify(responseCreateUser))

    response.status = 201 
    response.message = responseCreateUser.message
    // response.affectedRows=1
    response.body = responseCreateUser

   
    return response
  } catch (error) {
    console.log("user controller Something went wrong", error);
    response.message = error.message;
    return response
    
  }
  
};

exports.findAll = async (req, res) => {
  const title = req.query.title;
  let response={}
  try {
    const getAllUsers = await User.getAll(title)
    if (getAllUsers.affectedRows) {
      response.status = 200;
    } else {
      response.status = 404;
    }

    response.message = getAllUsers.message;
    response.body = getAllUsers;

    return res.status(response.status).send(response);
  } catch (error) {
    response.status = 500;
    console.log("Something went wrong", error);
    response.message = error.message;
    return res.status(response.status).send(response);
  }
  
  // await User.getAll(title, (err, data) => {
  //   if (err)
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving tutorials.",
  //     });
  //   else res.send(data)
  // });

  // const { ok, result, error } = await User.getAll(title);
  //   if (!ok) {
  //     next(error)
  //   } 
  //   return res.send(result);
};

// Find a single User by Id
exports.findOne = async (req, res) => {
  User.findById(req.params.id, (err, data) => {
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
