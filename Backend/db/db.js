const mongoose = require("mongoose");

function connectToDb() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then((res) => {
      console.log(`Connected to db: ${res.connection.host}`);
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = connectToDb;
