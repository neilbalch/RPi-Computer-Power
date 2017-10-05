#!/usr/bin/python3
import time
import sys

pinPower = 7
pinReset = 11

try:
  import RPi.GPIO as GPIO
  GPIO.setmode(GPIO.BOARD)
  GPIO.setup(pinPower, GPIO.OUT)
  #GPIO.setup(pinReset, GPIO.OUT)
except RuntimeError:
  print("Server Platform not Supported")
  sys.exit()

GPIO.output(pinPower, True)
print("Pin On")
time.sleep(1)
GPIO.output(pinPower, False)
print("Pin off")
GPIO.cleanup()