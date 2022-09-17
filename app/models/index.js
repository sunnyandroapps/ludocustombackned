const dbConfig = require("../config/db.config.js");
require('dotenv').config()

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.DB_URL;
db.room = require("./room.model")(mongoose);

module.exports = db;
