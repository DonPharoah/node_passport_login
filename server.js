const path = require("path");
const express = require("express");
const app = express();

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/", (req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.listen(3000, () => console.log("Listening on port 3000..."));
