const express = require("express");
const app = express();
require("dotenv").config();
require("./connection/conn");
const userApis = require("./controllers/user");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

// api's
app.use("/api/v1", userApis);

app.listen(`${process.env.PORT}`, () => {
  console.log("Server Started AT PORT = ${process.env.PORT}");
});
