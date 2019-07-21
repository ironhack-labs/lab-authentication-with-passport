require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

const DEFAULT_PASSWORD = "test";

/* This file has to be removed once the Boss account is made */

mongoose.connect(process.env.DB);

User.register(
  {
    username: "boss",
    name: "Julian",
    role: "Boss",
    email: "boss@ironhack.com",
    bio: `Hi I'm Julian`
  },
  DEFAULT_PASSWORD
)
  .then(user => {
    console.log("The Boss user was created.");
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
  });
