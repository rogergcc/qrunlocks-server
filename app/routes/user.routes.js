const express = require("express");
const router = express.Router();
const users = require("../controllers/user.controller.js");

router.post("/", users.create);

router.get("/", users.findAll);

router.get("/:id", users.findOne);

// app.use("/api/v1/users", router);

module.exports = router;