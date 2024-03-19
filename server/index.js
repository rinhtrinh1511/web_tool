const express = require("express");
var cors = require("cors");

const bodyParser = require("body-parser");
const Router = require("./routers/Routers");

const app = express();
const port = 8080;
app.use(cors());

app.use(bodyParser.json());

app.use("/api/v1/", Router);

app.get("/", (req, res) => {
  res.send("Server runing");
});

app.listen(port, () => {
  console.log(`Server runing on port : ${port}`);
});
