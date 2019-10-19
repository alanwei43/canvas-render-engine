const express = require("express"),
    path = require("path");
const app = express();

app.use("/", express.static(path.join(__dirname, "static/")));
app.listen("3002", () => {
    console.log("listen localhost:3002");
})