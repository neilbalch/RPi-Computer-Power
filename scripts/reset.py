#!/usr/bin/python3
import time
import sys

pinPower = 7
pinReset = 11

try:
  import RPi.GPIO as GPIO
  GPIO.setmode(GPIO.BOARD)
  #pins.setup(pinPower, GPIO.OUT)
  GPIO.setup(pinReset, GPIO.OUT)
except RuntimeError:
  print("Server Platform not Supported")
  sys.exit()
GPIO.output(pinReset, True)
print("Pin high")
time.sleep(0.5)
GPIO.output(pinReset, False)
print("Pin low")
GPIO.cleanup()