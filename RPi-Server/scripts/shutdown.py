import RPi.GPIO as pins
import time
import sys


pins.setmode(GPIO.BOARD)
pins.setup(7, GPIO.OUT)   # Power button
#pins.setup(11, GPIO.OUT) # Reset button

try:
  str(sys.argv[1])
except IndexError:
  print("Error: Not enough arguments!")
else:
  if str(sys.argv[1]) == "--hold":
    # Force Shutdown (Long Press)
    pins.output(7, True)
    print("Executing Forced Shutdown for 6 seconds:")
    print("Pin On")
    time.sleep(6)
    pins.output(7, False)
    print("Pin Off")
    pins.cleanup()
  elif str(sys.argv[1]) == "--fast":
    # Quick Press 
    pins.output(7, True)
    print("Executing fast shutdown for 2 seconds:")
    print("Pin On")
    time.sleep(2)
    pins.output(7, False)
    print("Pin Off")
    pins.cleanup()
  else:
    print("Error: Invalid parameter")
    print("Try: '--fast' or '--hold' for either a short or a long press repectively.")


