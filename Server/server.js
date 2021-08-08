/*
Server gets reactor data from mongoDB and sends it as JSON to client
*/

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Reactor = require("./Models/reactorSchema");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "*",
  })
);

// allow json requets to be made. not sure if needed yet.
app.use(express.json());

const mongoURL =
  "mongodb+srv://ShezadHassan:geonuclear22@nuclearreactors.ybyjf.mongodb.net/Nuclear-Reactors?retryWrites=true&w=majority";

mongoose
  .connect(mongoURL, { useUnifiedTopology: true, useNewUrlParser: true })
  .then((result) => {
    console.log("Database connected");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });

//Sends array of reactor info from mongoDB
app.get("/", (req, res) => {
  const reactors = Reactor.find().then((result) => {
    res.send(result);
  });
});
