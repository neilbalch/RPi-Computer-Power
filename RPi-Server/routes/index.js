var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');

var exec = require('child_process').exec;

var lastAttempt = new Date();
var failedAttempts = 0;

var moment = require("moment")

//var sleep = require('sleep');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.signedin){
    exec(__dirname+"/../scripts/__autorun.py",function startupFn(err,stdout,stderr){
      if(err){
        console.log(err);
        res.render('index', { title: 'CMS',stdout: "Script Execution Error!",failedAttempts:failedAttempts,lastFailedAttempt:moment(lastAttempt).fromNow(),exactTime:moment(lastAttempt).utcOffset(-7).format("MM-DD-YY HH:mm")});
        failedAttempts = 0;
        return;
      }
      res.render('index', { title: 'CMS',stdout: stdout,failedAttempts:failedAttempts,lastFailedAttempt:moment(lastAttempt).fromNow(),exactTime:moment(lastAttempt).utcOffset(-7).format("MM-DD-YY HH:mm")});
      failedAttempts=0;
    });
  }else{
    res.render('login', { title: 'CMS'});
  }
});

router.post('/login',function(req,res,next){
  console.log((new Date()).getTime() - lastAttempt.getTime());
  if((new Date()).getTime() - lastAttempt.getTime() < 10000){// make sure you cannot enter a password (invalid or not) within 6 seconds of your last invalid one
    res.send("Please don't spam");
    lastAttempt = new Date();
    return;
  }
  bcrypt.compare(req.body.password,"$2a$10$JA/Vy7.byewKZSbdo.j9ueahRKhpRd3/BQl9CYsJaifqJiXaNl7CG",function(err,pass){ // make sure the user entered the right password
    if(err){
      lastAttempt = new Date();
      res.send("<a href='/'>< Back</a> <b>Your suggestion was bad. You are now disowned.</b>");
      return;
    }
    if(pass){
      req.session.signedin = true;
      res.redirect("/");
    }else{
      failedAttempts+=1;
      lastAttempt = new Date();
      res.send("<a href='/'>&lt; Back</a> <b>Permission Denied</b>");
    }
  });
});

router.post('/logout',function(req,res,next){
  req.session.signedin = undefined;
  res.redirect('/');
});

router.post('/:script', function(req, res, next) {
    if(req.session.signedin){
      if(req.params.script == "hash.js" && req.body.params.indexOf("\"") != -1) {
        // Catch unclosed " mark for hash.js
        res.render("programError", {error: "Password cannot contain a \" symbol!"})
      } else if(req.params.script == "shutdown.py" && (req.body.params.indexOf("--hold") == -1 && req.body.params.indexOf("--fast") == -1)) {
        // Catch no parameter for shutdown.py
        res.render("programError", {error: "Shudown needs a parameter, either '--fast' or '--hold'!"})
      } else {
        exec(__dirname+"/../scripts/"+req.params.script+" "+req.body.params, function(err, stdout, stderr) {
          console.log("err: ",err,"stdout: ",stdout,"stderr: ",stderr);
          if(err){
            res.send("<a href='/'>< Back</a> <b>Program Error:</b> "+err.toString());
            return;
          }
          res.render("programOutput", {output: stdout});
        });
      }
    }else{
      res.send("<a href='/'>< Back</a> <b>Permission Denied</b>");
    }
});

router.post('/:gitpullmaster', function(req, res, next) {
    if(req.session.signedin){
      exec(__dirname+"/../scripts/gitpullmaster.sh", function(err, stdout, stderr) {
          console.log("err: ",err,"stdout: ",stdout,"stderr: ",stderr);
        if(err){
          res.send("<a href='/'>< Back</a> <b>Program Error:</b> "+err.toString());
          return;
        }
        res.render("programOutput", {output: stdout});
      });
    }else{
      res.send("<a href='/'>< Back</a> <b>Permission Denied</b>");
    }
});
module.exports = router;
