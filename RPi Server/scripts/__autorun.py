#!/usr/bin/python3
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BOARD)
GPIO.setup(13, GPIO.IN)

if GPIO.input(13):
  print("Power: On")
else:
  print("Power: Off")
