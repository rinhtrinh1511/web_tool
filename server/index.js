const express = require("express");
const cors = require("cors");
const authMiddleware = require("./middlewares/authToken");

const bodyParser = require("body-parser");
const Router = require("./routers/Routers");

const cookieParser = require("cookie-parser");

const app = express();
const port = 8080;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/v1/", authMiddleware, Router);

app.get("/", (req, res) => {
  res.send("Server runing");
});

app.listen(port, () => {
  console.log(`Server runing on port : ${port}`);
});
