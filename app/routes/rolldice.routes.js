module.exports = app => {
    const room = require("../controllers/room.controller");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", room.rollDice);

    app.use("/api/rolldice", router);
  };
  