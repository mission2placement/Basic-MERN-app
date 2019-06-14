const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const router = require("./routes/api")

// The port number is 3001
const API_PORT = 3001;
const app = express();

const cors = require("cors");

app.use(cors());

// this is our MongoDB database
const dbRoute = "mongodb://localhost/BasicMERNApp";

// mongodb+srv://BasicMERNApp:12345@cluster-mern-auth-omggg.mongodb.net/test?retryWrites=true

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));


// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// (optional) only made for logging and
app.use(logger("dev"));

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
