import RPi.GPIO as pins
import time


pins.setmode(GPIO.BOARD)
pins.setup(7, GPIO.OUT)   # Power button
#pins.setup(11, GPIO.OUT) # Reset button

pins.output(7, True)
time.sleep(6)
pins.output(7, False)
pins.cleanup()