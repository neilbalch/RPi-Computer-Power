# RPi-Computer-Power

Raspberry Pi Remote Computer Startup Device. Works best with Model 2B or better.

# Description:

Nodejs server for Raspberry Pi that controls a computer's state by remotely pressing the computer's power and reset buttons. Depending on the length of the "press," the computer will either shut down gracefully, hard reset, or start. The node server spawns python scripts that send commands to the RPi GPIO pins. There is also a feature that allows the user to see what power state the computer is in, using the motherboard power led wires.

> NOTE: The code makes refrences to a certain `keys.json` in the root of the server. For each deployment, you will need to specify a keys.json, containing a private key and a password hash for the server. _More info on this in the Initial Server Setup_ section of this readme.

## Repo organisation

* [repo]                - nodejs server
* repo_public           - Contains picures for the readme and else
* [TODO.md](https://github.com/neilbalch/RPi-Computer-Power/blob/master/TODO.md)  - TODO list for this repo

## Mechanical configuration:

Custom made Y-cables terminated with pin headers split off the power and reset switch wires so they can go to both the computer case and a breadboard. The breadboard has two [PC817](https://www.amazon.com/uxcell-2-54mm-Pitch-Mounting-Coupler/dp/B00S4YRMB4/ref=sr_1_1?ie=UTF8&qid=1493673969&sr=8-1&keywords=pc817) optocouplers on it, one for each of power and reset, that on one side are hooked up to the Y-cables and on the other to the GPIO. By applying 5V to the RPI GPIO pins, the optocouplers short the pins together, simulating a keypress.

There is also a Y-cable coming off of the motherdoard power led wires that tells the server if the computer state is on, allowing the user to verify that their computer is in the state that they want it to be in.

Schematic:

![alt text](https://github.com/neilbalch/RPi-Computer-Power/blob/master/repo_public/schematic.JPG)

Picture of the deployment in my computer: (The dirty side panel window is just an added bonus!)

![alt text](https://github.com/neilbalch/RPi-Computer-Power/blob/master/repo_public/deployment.jpg)

The pin numbers in the code refer to the physical pin numbers, not the numbers of the GPIO pins on the Raspberry Pi, the gray numbers in this picture:

![alt text](https://github.com/neilbalch/RPi-Computer-Power/blob/master/repo_public/rpiGPIO.png)

## Raspberry Pi configuration

The nodejs application is started by a script, mentioned in `/etc/rc.local`, that runs `sudo npm start` in the root folder of the server.

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
### Making `keys.json`
* `vim keys.json`

Type both strings into `keys.json` following this template:
```json
{
  "hash": "BCRYPT_HASH",
  "secret": "SECRET_KEY"
}
```

## Run Server
* `sudo npm start`

# Troubleshooting

* If at some point when running the server or individual scripts you get the error `/usr/local/bin/node^M: bad interpreter: No such file or directory` run `dos2unix [filename]`, on the file that produced the error. dos2unix may be obtained using `apt-get`.
* If the server reports an error when trying to execute one of the scripts that reads like, `Error: Command failed: /bin/sh -c /home/pi/RPi-Computer-Power/routes/../scripts/hash.js 12345678 /bin/sh: 1: /home/pi/RPi-Computer-Power/routes/../scripts/hash.js: Permission denied` just run `chmod +x *` in the scripts directory, as git has caused the permissions to change during a refresh, and nodejs no longer has permission to execute it.
* If the `Git Pull Origin Master` button doesn't work, you need to reset the timeout for git to cache your credentials manually on the server, as descrbed [here](https://help.github.com/articles/caching-your-github-password-in-git/#platform-linux)
* If the server reports when executing `hash.js` that it cannot find the module bcrypt, run `sudo npm install` in the server directory.
* If the server reports the error `/bin/sh: 1: /home/pi/RPi-Computer-Power/routes/../scripts/hash.js: not found` or similar when running `hash.js`, run `which node` manually and edit the first line of `scripts/hash.js` file manually to say the correct path to your node installation, *_or_* make a symlink to the correct node path by running `ln -s [YOUR_ACTUAL_NODE_PATH] /usr/local/bin/node`, where `YOUR_ACTUAL_NODE_PATH` refers to the output of `which node`
* If the server reports an error when trying to start (`sudo npm start`) regarding a port access issue, i.e. `Error: listen EACCES 0.0.0.0:443`, make sure that node has access to the default https port (443)