const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "",
    password: "",
    database: "smart-brain"
  }
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

//GET REUQUESTS
app.get("/", (req, res) => {
  res.send(database.users);
});

//GET USER PROFILE DATA
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("User not found");
      }
    })
    .catch(err => res.status(400).json("Error getting User"));
});

//POST REUQUESTS
//USER SIGNIN
app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      bcrypt.compare(password, data[0].hash).then(isValid => {
        if (isValid) {
          db.select("*")
            .from("users")
            .where("email", "=", email)
            .then(user => {
              res.json(user[0]);
            })
            .catch(err => res.status(400).json("unable to get user"));
        } else {
          res.status(400).json("wrong credentials");
        }
      });
    })
    .catch(err => res.status(400).json("wrong credentials"));
});

//REGISTER NEW USER
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, 10).then(hash => {
    db.transaction(trx => {
      trx
        .insert({
          hash: hash,
          email: email
        })
        .into("login")
        .returning("email")
        .then(loginEmail => {
          return trx("users")
            .returning("*")
            .insert({
              name: name,
              email: loginEmail[0],
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch(err => res.status(400).json("unable to register"));
  });
});

//PUT REUQUESTS

//COUNT IMAGE UPLOADS
app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("Unable to get any entries"));
});

//LISTEN
app.listen(3000, () => {
  //console.log("app is running on port 3000");
});

/*
/ --> res = this is working
/signin --> POST = success || fail
/register --> POST = Return new user {}
/profile/:userId --> GET = user {}
/image --> PUT --> user {count++}
*/

/* 
app.use(express.urlencoded({extended: false}));
app.use(express.json());
*/
