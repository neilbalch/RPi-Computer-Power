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

try:
  str(sys.argv[1])
except IndexError:
  print("Error: Not enough arguments!")
else:
  if str(sys.argv[1]) == "--hold":
    # Force Shutdown (Long Press)
    GPIO.output(pinPower, True)
    print("Executing Forced Shutdown for 6 seconds:")
    print("Pin On")
    time.sleep(6)
    GPIO.output(pinPower, False)
    print("Pin Off")
    GPIO.cleanup()
  elif str(sys.argv[1]) == "--fast":
    # Quick Press
    GPIO.output(pinPower, True)
    print("Executing fast shutdown for 2 seconds:")
    print("Pin On")
    time.sleep(2)
    GPIO.output(pinPower, False)
    print("Pin Off")
    GPIO.cleanup()
  else:
    print("Error: Invalid parameter")
    print("Try: '--fast' or '--hold' for either a short or a long press repectively.")
    GPIO.cleanup()