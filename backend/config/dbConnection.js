const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
        "Database connected:", 
        conn.connection.host, 
        conn.connection.name
    );
    } catch (err) {
        console.error("Cannot connect to database:", 
		err.message);
        process.exit(1);
        }
};

module.exports = { connectDB };
