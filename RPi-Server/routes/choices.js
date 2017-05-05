var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');

var exec = require('child_process').exec;

/* GET home page. */
router.get('/', function(req, res, next) {
  exec(__dirname+"/../scripts/__autorun.py", function(err, stdout, stderr) {
    if(err){
      console.log(err);
      res.render('index', { title: 'Express',stdout: "Error"});
      return;
    }
    res.render('index', { title: 'Express',stdout: stdout});
  });
});

router.post('/:script', function(req, res, next) {
//  bcrypt.compare(req.body.password,"$2a$10$XlQowFGQZD8yUpBM3PlKC.vbQV4xHXqkQ8XDAkI3JdQeUl5dk9INi",function(err,pass){
   bcrypt.compare(req.body.password,"$2a$10$JA/Vy7.byewKZSbdo.j9ueahRKhpRd3/BQl9CYsJaifqJiXaNl7CG",function(err,pass){
    if(err){
      res.send("<a href='/'>< Back</a> <b>Password Error:</b>");
      return;
    }
    if(pass){
      exec(__dirname+""+req.params.script+", function(err, stdout, stderr) {
        console.log(err,stdout,stderr);
        if(err){
          res.send("<a href='/'>< Back</a> <b>Program Error:</b> "+err.toString());
        }else{
          res.send("<a href='/'>< Back</a> <b>Program Output:</b> <div style='white-space:pre-line'>"+stdout+"</div>");
        }
      });
    }else{
      res.send("<a href='/'>< Back</a> <b>Permission Denied</b>");
    }
  });
});

module.exports = router;
