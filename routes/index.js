var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs");
var exec = require('child_process').exec;
var moment = require("moment")

// Storage for the date and time of last failed login attempt
var lastAttempt = new Date();
// Count of failed login since last successful login
var failedAttempts = 0;

/* GET Home Page */
router.get('/', function(req, res, next) {
  if(req.session.signedin){
    // Execute autorun python script
    exec(__dirname+"/../scripts/__autorun.py",function startupFn(err,stdout,stderr){
      if(err){
        // Log the error
        console.log("index.js: autorun script execution error ", err);
        res.render('index', { title: 'CMS', stdout: "Script Execution Error!", failedAttempts: failedAttempts, lastFailedAttempt: moment(lastAttempt).fromNow(), exactTime: moment(lastAttempt).utcOffset(-7).format("MM-DD-YY HH:mm")});
        return;
      } else {
        res.render('index', { title: 'CMS', stdout: stdout, failedAttempts: failedAttempts, lastFailedAttempt: moment(lastAttempt).fromNow(), exactTime: moment(lastAttempt).utcOffset(-7).format("MM-DD-YY HH:mm")});
      }
      // Reset number of failed login attempts
      failedAttempts = 0;
    });
  }else{
    res.render('login', { title: 'CMS'});
  }
});

/* POST Login Page */
router.post('/login',function(req,res,next){
  console.log("index.js: Time since last failed attempt: (ms) ", (new Date()).getTime() - lastAttempt.getTime());

  // Make sure you cannot enter a password (invalid or not) within 10 seconds of your last invalid one
  if((new Date()).getTime() - lastAttempt.getTime() < 10000){
    console.log("index.js: Login attempt within 10sec of last failed attempt");
    res.render("programError", {error: "Please don't spam"});
    failedAttempts+=1;
    lastAttempt = new Date();
    return;
  }

  // Compare the entered password to the known hash
  bcrypt.compare(req.body.password,require("../keys").hash,function(err,pass){ // make sure the user entered the right password
    if(err) {
      // Log error
      console.log("index.js: Error comparing user's password with known hash");
      failedAttempts+=1;
      lastAttempt = new Date();
      res.render("programError", {error: "Your suggestion was bad. You are now disowned."});
      return;
    }
    if(pass) {
      console.log("index.js: Successful login");
      req.session.signedin = true;
      res.redirect("/");
    } else {
      // Log failed attempt
      console.log("index.js: Failed login attempt");
      failedAttempts+=1;
      lastAttempt = new Date();
      res.render("programError", {error: "Permission Denied"});
    }
  });
});

/* POST Logout Page */
router.post('/logout',function(req,res,next) {
  // Invalidate session
  console.log("index.js: User logged out");
  req.session.signedin = undefined;
  res.redirect('/');
});

/* POST Script Submission */
router.post('/:script', function(req, res, next) {
    if(req.session.signedin) {
      if(req.params.script == "hash.js" && req.body.params.indexOf("\"") != -1) {
        // Catch unclosed " mark for hash.js
        console.log("index.js: hash.js: Password cannot contain a \" symbol!");
        res.render("programError", {error: "Password cannot contain a \" symbol!"});
      } else if(req.params.script == "hash.js" && req.body.params == "") {
        // Catch null input for hash.js
        console.log("index.js: hash.js: Password my not be zero characters in length!");
        res.render("programError", {error: "Password my not be zero characters in length!"});
      } else if(req.params.script == "shutdown.py" && (req.body.params.indexOf("--hold") == -1 && req.body.params.indexOf("--fast") == -1)) {
        // Catch no parameter for shutdown.py
        console.log("index.js: shutdown.py: Shudown needs a parameter, either '--fast' or '--hold'!");
        res.render("programError", {error: "Shudown needs a parameter, either '--fast' or '--hold'!"});
      } else {
        exec(__dirname+"/../scripts/"+req.params.script+" "+req.body.params, function(err, stdout, stderr) {
          // Log Script output
          console.log("index.js: Script execution output: ", "err: ", err, "stdout: ", stdout, "stderr: ", stderr);
          if(err) {
            // Log the Error
            console.log("index.js: Program Error:", err.toString());
            res.render("programError", {error: err.toString()});
            return;
          }
          if(req.params.script == "hash.js" || req.params.script == "gitpullmaster") {
            // Output from hash.js and gitpullmaster needs to be shown
            console.log("index.js: Showing script output");
            res.render("programOutput", {output: stdout});
          } else {
            // If the script doesn't output important data, don't show the output
            console.log("index.js: Hiding script output, redirecting to /");
            res.redirect("/");
          }
        });
      }
    } else {
      // Log the Error
      console.log("index.js: Script page accessed without valid session");
      res.render("programError", {error: "Permission Denied: Please Login"});
    }
});

/* POST Git Pull Submission */
router.post('/:gitpullmaster', function(req, res, next) {
    if(req.session.signedin) {
      exec(__dirname+"/../scripts/gitpullmaster.sh", function(err, stdout, stderr) {
        console.log("err: ",err,"stdout: ",stdout,"stderr: ",stderr);
        if(err) {
          res.render("programError", {error: err.toString()});
          return;
        }
        res.render("programOutput", {output: stdout});
      });
    } else {
      // Log the Error
      console.log("index.js: Script page accessed without valid session");
      res.render("programError", {error: "Permission Denied: Please Login"});
    }
});

/* POST Reboot Submission */
router.post('/:serverReboot', function(req, res, next) {
    if(req.session.signedin){
      exec(__dirname+"/../scripts/restart.sh", function(err, stdout, stderr) {
        console.log("err: ",err,"stdout: ",stdout,"stderr: ",stderr);
        if(err) {
          res.render("programError", {error: err.toString()});
          return;
        }
        res.render("programOutput", {output: stdout});
      });
    } else {
      // Log the Error
      console.log("index.js: Script page accessed without valid session");
      res.render("programError", {error: "Permission Denied: Please Login"});
    }
});

module.exports = router;