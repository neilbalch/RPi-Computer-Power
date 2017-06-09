#!/usr/bin/python3
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BOARD)
GPIO.setup(13, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

if GPIO.input(13):
  print("<span style='color:green;font-weight:bold;font-size:18px'>On</span>")
else:
  print("<span style='color:red;font-weight:bold;font-size:18px'>Off</span>")
