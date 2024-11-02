const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

const user = require("./routes/userRoute");
const product = require("./routes/productRoute");

app.use("/api/v1/products", product);
app.use("/api/v1", user);

module.exports = app;