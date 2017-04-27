import RPi.GPIO as pins
import time


pins.setmode(GPIO.BOARD)
#pins.setup(7, GPIO.OUT) # Power button
pins.setup(11, GPIO.OUT) # Reset button

pins.output(11, True)
time.sleep(0.5)
pins.output(11, False)
pins.cleanup()