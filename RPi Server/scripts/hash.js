#!/usr/local/bin/node
var bcrypt = require("bcrypt");

//console.log(bcrypt.hashSync(process.argv[2],10));
console.log(bcrypt.hashSync("2",10));
console.log("Hello World");
