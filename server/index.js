const express = require("express");

const bodyParser = require("body-parser");
const authRoutes = require("./routers/Routers")

const app = express();
const port = 8080;

app.use(bodyParser.json());

app.use('/', authRoutes);

app.get("/", (req, res) => {
    res.send("Server runing");
});

app.listen(port, () => {
    console.log(`Server runing on port : ${port}`);
});
