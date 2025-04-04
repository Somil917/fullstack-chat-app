const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { app } = require("./lib/socket");
const connectToDb = require("./db/db");
const userRoutes = require("./routes/user.routes");
const messageRoutes = require("./routes/message.routes");

const path = require("path");
const __dirname = path.resolve();

connectToDb();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hi i am a server made by somil");
});

app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}

module.exports = app;
