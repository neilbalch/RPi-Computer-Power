#!/home/ubuntu/.nvm/versions/node/v4.4.3/bin/node
var bcrypt = require("bcrypt");
console.log(bcrypt.hashSync(process.argv[2],10));