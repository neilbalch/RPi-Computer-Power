# RPi-Computer-Power

Raspberry Pi Remote Computer Startup Device. Works best with Model 2B or better.

## Description

Node server for Raspberry Pi that controls a computer's state by remotely pressing the computer's power and reset buttons. Depending on the length of the "press," the computer will either shut down gracefully, hard reset, or start. The node server spawns python scripts that send commands to the RPi GPIO pins. There is also a feature that allows the user to see what power state the computer is in, using the motherboard power led wires.

> NOTE: The code makes refrences to a certain `keys.json` in the root of the server. For each deployment, you will need to specify a keys.json, containing a private key and a password hash for the server. _More info on this in the Initial Server Setup_ section of this readme.

The setup guide in this document demonstrates how to generate a self-signed certificate, which will not satisfy the requirement to have a certificate signed by a certificate authority for any browser to mark the connection as secure without some.

## Repo organisation

* [repo]                - Node server
* repo_public           - Contains picures for the README and other md files
* [TODO.md](https://github.com/neilbalch/RPi-Computer-Power/blob/master/TODO.md)  - TODO list for this repo

## Mechanical configuration

Custom made Y-cables terminated with pin headers split off the power and reset switch wires so they can go to both the computer case and a breadboard. The breadboard has two [PC817](https://www.amazon.com/uxcell-2-54mm-Pitch-Mounting-Coupler/dp/B00S4YRMB4/ref=sr_1_1?ie=UTF8&qid=1493673969&sr=8-1&keywords=pc817) optocouplers on it, one for each of power and reset, that on one side are hooked up to the Y-cables and on the other to the GPIO. By applying 5V to the RPI GPIO pins, the optocouplers short the pins together, simulating a keypress.

There is also a Y-cable coming off of the motherdoard power led wires that tells the server if the computer state is on, allowing the user to verify that their computer is in the state that they want it to be in.

Schematic:

![alt text](https://github.com/neilbalch/RPi-Computer-Power/blob/master/repo_public/schematic.JPG)

Picture of the deployment in my computer: (The dirty side panel window is just an added bonus!)

![alt text](https://github.com/neilbalch/RPi-Computer-Power/blob/master/repo_public/deployment.jpg)

The pin numbers in the code refer to the physical pin numbers, not the numbers of the GPIO pins on the Raspberry Pi, the gray numbers in this picture:

![alt text](https://github.com/neilbalch/RPi-Computer-Power/blob/master/repo_public/rpiGPIO.png)

## Raspberry Pi configuration

The Node application is started by a script, mentioned in `/etc/rc.local`, that runs `sudo npm start` in the root folder of the server.

# Initial Server Setup

There are a set of steps I have found to work for setting the server up for the first time on a Raspberry Pi.

## Initial Package and Code Download

* `sudo apt-get update; sudo apt-get upgrade`
* `curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -; sudo apt-get install -y nodejs` [(Link to official nodejs installation guide)](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)
* `sudo apt-get install python-rpi.gpio python3-rpi.gpio`
* `git clone https://github.com/neilbalch/RPi-Computer-Power.git`
* `cd RPi-Computer-Power`
* `sudo npm install`

## Make a `keys.json` file

### Generating Keys and Hashes

A hash can be made by running

* `node scripts/hash.js [PASSWORD]`

A secure secret key can be made by running:

* `node -e "console.log('\x1b[32m'+require('crypto').randomBytes(64).toString('hex')+'\x1b[0m')"`

The output strings to both will be the bcrypt hash and the secret key respectively.

### Configuration

#### Create `keys.json`

* `vim keys.json`

Type both strings into `keys.json` following this template:

```json
{
  "hash": "BCRYPT_HASH",
  "secret": "SECRET_KEY"
}
```

#### Generate Private Keys and Certificates

* `mkdir sslcert`

Generate private RSA key:

* `openssl genrsa 1024 > sslcert/private.key`

Create a certificate request:

* `openssl req -new -key sslcert/private.key -out sslcert/cert.csr`

Generate a signed certificate based on the certificate request:

* `openssl x509 -req -in cert.csr -signkey sslcert/private.key -out sslcert/certificate.pem`

## Run Server

* Debug Server (Reveals stacktrace to user)
  * `sudo npm start` ***OR***
  * `sudo node bin/www` ***OR***
  * `sudo nodemon bin/www` (Server will automatically restart if it detects that a source file has been changed)

* Production Server (Doesn't reveal stacktrace to user)
  * `sudo npm start --production` ***OR***
  * `sudo node bin/www --production` ***OR***
  * `sudo nodemon bin/www --production` (Server will automatically restart if it detects that a source file has been changed)

# Troubleshooting

### Permission Errors

* When running scripts you get an error like, `Error: Command failed: /bin/sh -c /home/pi/RPi-Computer-Power/routes/../scripts/hash.js 12345678 /bin/sh: 1: /home/pi/RPi-Computer-Power/routes/../scripts/hash.js: Permission denied`
  * Run `chmod +x *` in the scripts directory, as git has caused the permissions to change.
* The server reports an error when trying to start (`sudo npm start` or `sudo nodemon bin/www`) regarding a port access issue, i.e. `Error: listen EACCES 0.0.0.0:443`
  * Make sure that node has access to the default https port (443) and that you are running the command with `sudo`.

### Configuration Errors

* When running scripts you get the error `/usr/local/bin/node^M: bad interpreter: No such file or directory`
  * Run `dos2unix [filename]`, (apt-get) on the file that produced the error.
* The `Git Pull Origin Master` button doesn't work
  * Reset the timeout for git credentials caching manually, as descrbed [here on the GitHub Help](https://help.github.com/articles/caching-your-github-password-in-git/#platform-linux)
* The server reports when executing `hash.js` that it cannot find the module bcrypt
  * Run `sudo npm install`.
* The server reports the error `/bin/sh: 1: /home/pi/RPi-Computer-Power/routes/../scripts/hash.js: not found` or similar when running `hash.js`
  * Edit the first line of `scripts/hash.js` file to say the correct path to your node installation, (`which node`) ***or*** make a symlink to the correct node path by running `ln -s [YOUR_ACTUAL_NODE_PATH] /usr/bin/node`, where `YOUR_ACTUAL_NODE_PATH` refers to the node path.
