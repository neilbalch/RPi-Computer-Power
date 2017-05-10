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
	#pins.setup(7, GPIO.OUT) # Power button
	GPIO.setup(11, GPIO.OUT) # Reset button

	GPIO.output(11, True)
	print("Pin high")
	time.sleep(0.5)
	print("Wait 0.5 Secs")
	GPIO.output(11, False)
	print("Pin low")
	GPIO.cleanup()
