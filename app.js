const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const cors = require("cors");

const rootDir = require("./util/path");
const libraryRoute = require("./routes/libraryRoute");
const sequelize = require("./util/database");
const db = require("./models/libSequelize");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(cors());
app.use("/library", libraryRoute);
sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("server is running successfully on port 3000");
      app.get("/", (req, res, next) => {
        res.sendFile(path.join(__dirname, "views", "index.html"));
      });
    });
  })
  .catch((err) => console.log(err));
