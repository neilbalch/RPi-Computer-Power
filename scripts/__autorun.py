#!/usr/bin/python3
import subprocess
import re
import sys

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

if GPIO.input(13):
  print("<span style='color:green;font-weight:bold;font-size:18px'>On: "+output+"</span>")
else:
  print("<span style='color:red;font-weight:bold;font-size:18px'>Off: "+output+"</span>")