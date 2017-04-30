#!/usr/bin/python3
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BOARD)
GPIO.setup(13, GPIO.IN)

#TODO(Neil): Make the status work

if GPIO.input(13):
  print("Power: On")
else:
  print("Power: Off")
