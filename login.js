const mongoose=require('mongoose');
var bodyParser = require('body-parser');
const express =require('express');
mongoose.connect('mongodb://localhost:27017/useer', {useNewUrlParser: true});
const schema=mongoose.Schema({
  email:{
      type:String,
      unique:true,
      sparse:true,
      required:true,
      trim:true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  pwd:{
      type:String,
      required:true
  },
  mb_no:{
      type:Number,
      required:true
  }
})
module.exports = mongoose.model('user', schema);