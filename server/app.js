const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./connection/conn");
const userApis = require("./controllers/user");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5175", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello");
});

// api's
app.use("/api/v1", userApis);

app.listen(`${process.env.PORT}`, () => {
  console.log(`Server Started AT PORT = ${process.env.PORT}`);
});
