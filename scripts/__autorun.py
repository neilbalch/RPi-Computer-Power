#!/usr/bin/python3
import subprocess
import re
import sys
import time

# Command usage: ./__autorun.py [--debug]

try:
  import RPi.GPIO as GPIO
  GPIO.setmode(GPIO.BOARD)
  GPIO.setup(13, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
except RuntimeError:
  print("Server Platform not Supported")
  sys.exit()

# Setup bash command
command = "vcgencmd measure_temp"
process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
output, error = process.communicate()
output = str(output)
output = re.search('temp.+?C', output).group(0)

# If "--debug" flag is set, be explicit when collecting data
try:
  if str(sys.argv[1]) == "--debug":
    debugMode = True
except IndexError:
  debugMode = False

# Collect data about power state
count = 0
for x in range(5):
  if GPIO.input(13):
    count+=1
    if debugMode:
      # Debug mode is on, pretty print sensed value
      print("On" if GPIO.input(13) else "Off");
  time.sleep(0.125)

# If noisy signal is high > 80% of the time, the computer is on
if count/5 > 0.8:
  print("<span style='color:green;font-weight:bold;'>On: "+output+"</span>")
else:
  print("<span style='color:red;font-weight:bold;'>Off: "+output+"</span>")
