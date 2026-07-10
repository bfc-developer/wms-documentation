app.js :- require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { router } = require("./routes/routes");

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.static("frontend/public"));

app.use("/", router);

module.exports = app;