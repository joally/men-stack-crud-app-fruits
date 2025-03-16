// models/fruit.js

const mongoose = require("mongoose");

const fruitSchema = new mongoose.Schema({
    name: String,
    isReadyToEat: Boolean,
  });

  const Fruit = mongoose.model("Fruit", fruitSchema); // create model

  module.exports = Fruit;
//this module exports the fruit model
//the fruit model provide us with full-CRUD
//functionality over our fruit collection
// in the fruit database