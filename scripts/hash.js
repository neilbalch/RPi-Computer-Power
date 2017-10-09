#!/usr/local/bin/node
var bcrypt = require("bcryptjs");

// Hash Password with salt "10"
console.log(bcrypt.hashSync(process.argv[2], 10));