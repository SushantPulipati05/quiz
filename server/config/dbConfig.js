const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://smgeventztest:wtqwyBOlLfhdubco@main.sfq5x.mongodb.net/");

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("Mongo Db Connection Successful");
});

connection.on("error", (err) => {
  console.log("Mongo Db Connection Failed");
});

module.exports = connection;
