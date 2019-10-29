const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

//GET REUQUESTS
app.get("/", (req, res) => {
  res.send("it is working");
});

//GET USER PROFILE DATA
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

//USER SIGNIN
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});

//REGISTER NEW USER
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

//COUNT IMAGE UPLOADS
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

//LISTEN
app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
