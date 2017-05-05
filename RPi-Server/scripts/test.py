import RPi.GPIO as GPIO
import time


GPIO.setmode(GPIO.BOARD)
GPIO.setup(7, GPIO.OUT)


for x in range(10):
    GPIO.output(7, True)
    print("Pin 7 ON")
    time.sleep(1)
    GPIO.output(7, False)
    print("Pin 7 OFF")
    time.sleep(1)
    print("Loop #: " + str(x))
GPIO.cleanup()
