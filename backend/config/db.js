const mongoose = require("mongoose");
require("colors");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error(
        "MONGO_URI is not defined. Make sure backend/.env exists and contains a valid MONGO_URI."
      );
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(
      ` MongoDB Connected: ${conn.connection.host}`.bgGreen.black
    );
  } catch (error) {
    console.log(` DB Error: ${error.message}`.bgRed.white.bold);
    process.exit(1); // exit if DB fails
  }
};

module.exports = connectDB;