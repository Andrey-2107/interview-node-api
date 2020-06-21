const mongoose = require("mongoose");

async function connectDatabase(url) {
  try {
    return await mongoose.connect(url, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    });
  } catch (ex) {
    console.error(ex);
  }
}

module.exports = connectDatabase;
