// module.exports = app => {


  const express = require('express')
  const router = express.Router()
   const attendance = require("../controllers/attendance.controller.js");

  
 
   router.post("/", attendance.create)
 
   router.get("/", attendance.findAll)
 
   router.get("/:id", attendance.findOne)
 

  //  app.use('/api/v1/attendance', router)
//  };

 module.exports = router;