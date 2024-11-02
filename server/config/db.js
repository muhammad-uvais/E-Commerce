const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose
        .connect(process.env.DB_URL)
        .then((data) => {
            console.log(`MongoDB connected Successfully: ${data.connection.host}`);
        })
};
module.exports = connectDatabase; 