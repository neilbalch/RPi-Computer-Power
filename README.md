# RPi-Computer-Power
Raspberry Pi Remote Computer Startup Device

# Description: 
Nodejs server for Raspberry Pi that controls a computer's state by remotely pressing the computer's power and reset buttons. Depending on the length of the "press," the computer will either shut down gracefully, hard reset, or start. The node server spawns python scripts that send commands to the RPi GPIO pins.
    
## Mechanical Configuration:
Custom made Y-cables terinated with pin headers split off the power and reset switch wires so they can go to both the computer case and a breadboard. The breadboard has two PC817 optocouplers on it, one for each of power and reset, that on one side are hooked up to the Y-cables and on the other to the GPIO. By applying 5V to the RPI GPIO pins, the optocouplers short the pins together, simulating a keypress.

## Raspberry Pi Configuration
The nodejs application is started by a script, mentioned in `/etc/rc.local`, that runs `sudo npm start` in the root folder of the server.
