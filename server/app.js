const express = require("express");
const app = express();
require("dotenv").config();
require("./connection/conn");

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(`${process.env.PORT}`, () => {
  console.log("Server Started AT PORT = ${process.env.PORT}");
});
