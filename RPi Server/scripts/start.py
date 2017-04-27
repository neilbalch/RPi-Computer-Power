#!/usr/bin/python3
from optparse import OptionParser
import RPi.GPIO as GPIO
import time

parser = OptionParser()
parser.add_option("-f", "--file", dest="filename",
                  help="write report to FILE", metavar="FILE")
parser.add_option("-q", "--quiet",
                  action="store_false", dest="verbose", default=True,
                  help="don't print status messages to stdout")
(options, args) = parser.parse_args()
if(args == []):
	GPIO.setmode(GPIO.BOARD)
	GPIO.setup(7, GPIO.OUT)   # Power button
	#pins.setup(11, GPIO.OUT) # Reset button
	
	GPIO.output(7, True)
	print("Pin On")
	time.sleep(1)
	print("Wait 1 Sec")
	GPIO.output(7, False)
	print("Pin off")
	GPIO.cleanup()
