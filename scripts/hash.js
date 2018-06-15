#!/usr/bin/node
var bcrypt = require("bcryptjs");

// Command usage: ./hash.js PASSWORD [HASH SALT]

// If a hash salt is passed in, use it
if(process.argv.length == 4) {
  // Hash Password with salt from cli argument
  console.log(bcrypt.hashSync(process.argv[2], Number(process.argv[3])));
} else {
  var keysFile = require("../keys.json");

  // Hash Password with salt from hashSalt key in ../keys.json
  console.log(bcrypt.hashSync(process.argv[2], Number(keysFile["hashSalt"])));
}
