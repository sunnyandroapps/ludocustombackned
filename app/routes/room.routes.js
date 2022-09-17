module.exports = app => {
  const room = require("../controllers/room.controller");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/", room.create);

  // Retrieve all room
  router.get("/", room.findAll);

  // Retrieve all published room
  router.get("/published", room.findAllPublished);

  // Retrieve a single Tutorial with id
  router.get("/:id", room.findOne);

  // Update a Tutorial with id
  router.put("/:id", room.update);

  // Delete a Tutorial with id
  router.delete("/:id", room.delete);

  // Create a new Tutorial
  router.delete("/", room.deleteAll);

  app.use("/api/rooms", router);
};
