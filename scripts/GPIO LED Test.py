import RPi.GPIO as pins
import time


pins.setmode(GPIO.BOARD)
pins.setup(7, GPIO.OUT)


for x in range(10):
    pins.output(7, True)
    print("Pin 7 ON")
    time.sleep(1)
    pins.output(7, False)
    print("Pin 7 OFF")
    time.sleep(1)
    print("Loop #: " + str(x))
pins.cleanup()