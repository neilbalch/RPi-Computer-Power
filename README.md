# RPi-Computer-Power
Raspberry Pi Remote Computer Startup Device

# Description: 
Nodejs server for Raspberry Pi that controls a computer's state by remotely pressing the computer's power and reset buttons. Depending on the length of the "press," the computer will either shut down gracefully, hard reset, or start. The node server spawns python scripts that send commands to the RPi GPIO pins.
    
## Mechanical Configuration:
Custom made Y-cables terinated with pin headers split off the power and reset switch wires so they can go to both the computer case and a breadboard. The breadboard has two [PC817](https://www.amazon.com/uxcell-2-54mm-Pitch-Mounting-Coupler/dp/B00S4YRMB4/ref=sr_1_1?ie=UTF8&qid=1493673969&sr=8-1&keywords=pc817) optocouplers on it, one for each of power and reset, that on one side are hooked up to the Y-cables and on the other to the GPIO. By applying 5V to the RPI GPIO pins, the optocouplers short the pins together, simulating a keypress.

## Raspberry Pi Configuration
The nodejs application is started by a script, mentioned in `/etc/rc.local`, that runs `sudo npm start` in the root folder of the server.

# Troubleshooting
If at some point when running the server or individual scripts you get the error `/usr/local/bin/node^M: bad interpreter: No such file or directory` run `dos2unix [filename]`, on the file that produced the error. dos2unix may be obtained using `apt-get`.
