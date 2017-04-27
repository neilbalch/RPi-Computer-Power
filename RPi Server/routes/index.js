var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');

var exec = require('child_process').exec;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/:script', function(req, res, next) {
  bcrypt.compare(req.body.password,"$2a$10$LM0kdDVrXBgtgHLmjLw32.IEjCxLJOLLxKP8tfksJgaZDGzyBen9W",function(err,pass){
    if(err){
      res.send("<a href='/'>< Back</a> <b>Password Error:</b>");
      return;
    }
    if(pass){
      exec(__dirname+"/../scripts/"+req.params.script+" "+(req.body.params || ""), function(err, stdout, stderr) {
        console.log(err,stdout,stderr);
        if(err){
          res.send("<a href='/'>< Back</a> <b>Program Error:</b> "+err.toString());
        }else{
          res.send("<a href='/'>< Back</a> <b>Program Output:</b> <div style= 'white-space:pre-line'>"+stdout+"</div>");
        }
      });
    }else{
      res.send("<a href='/'>< Back</a> <b>Permission Denied</b>");
    }
  });
});

module.exports = router;
