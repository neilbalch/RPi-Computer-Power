#!/usr/local/bin/node
var bcrypt = require("bcrypt");

console.log("Hashed Password: " + bcrypt.hashSync(process.argv[2],10));
