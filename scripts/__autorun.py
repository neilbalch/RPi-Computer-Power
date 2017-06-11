#!/usr/bin/python3
import RPi.GPIO as GPIO
import subprocess
import re
GPIO.setmode(GPIO.BOARD)
GPIO.setup(13, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

# Setup bash command
command = "vcgencmd measure_temp"
process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
output, error = process.communicate()
output = str(output)
output = re.search('temp.+?C', output).group(0)

if GPIO.input(13):
  print("<span style='color:green;font-weight:bold;font-size:18px'>On: "+output+"</span>")
  #print("<span style='font-size:16px' CPU Package Temp: >"+output+"</span>")
else:
  print("<span style='color:red;font-weight:bold;font-size:18px'>Off: "+output+"</span>")
  #print("<span style='font-size:16px' CPU Package Temp: >"+output+"</span>")
