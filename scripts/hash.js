#!/usr/local/bin/node
var bcrypt = require("bcrypt");

console.log(bcrypt.hashSync(process.argv[2],10));
