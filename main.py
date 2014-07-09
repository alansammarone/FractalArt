#!/usr/bin/env python      
import Tkinter    
import Image, ImageTk
import cmath
import numpy
import math
import sys
import colorsys

class Application(Tkinter.Frame):              
    def __init__(self, master=None):
        Tkinter.Frame.__init__(self, master)   
        self.grid()                       
        
        
        
        self.width = 400.0
        self.height = 300.0
        self.setupImage()
        #self.drawMandelbrot(-2, 2)

    def setupImage(self):
        self.image = Image.new("RGB", (int(self.width), int(self.height)))
        self.imageData = self.image.load();
        self.drawMandelbrot(-2, 0)    
        
        self.photoImage.bind("click", callback)
        label = Tkinter.Label(image=self.photoImage)
        label.grid()

    def drawMandelbrot(self, startX, endX):
    	xLength = endX - startX
    	yLength = (self.height / self.width) * xLength
    	increment = xLength / self.width;
    	scale = self.width/(endX - startX)
    
    	halfwidth = self.width/2
    	halfheight = self.height/2
    	
    	for y in numpy.arange(yLength/2, -yLength/2, -increment):
    		for x in numpy.arange(startX, endX, increment):

    			_x = scale*(x-startX/2) + halfwidth
    			_y = halfheight - (scale*y)
				
    			_x = int(_x)
    			_y = int(_y)
    			
    			c = complex(x, y)
    			z = 0
    			for i in range(100):
    				z = z*z + c
    				hasEscaped = False

    				if abs(z) > 2:
    					self.imageData[_x, _y] = self.getPixelColor(i, z)
    					hasEscaped = True
    					break

	    			if not hasEscaped:
	    				self.imageData[_x, _y] = (0, 0, 0)


		
    
    def getPixelColor(self, iterations, z):	


    	b = iterations + 1 - math.log(math.log(abs(z)))/math.log(2)
    	
    	c = colorsys.hsv_to_rgb(.685 - b/250, .75, .75)



    	return (int(c[0]*255), int(c[1]*255), int(c[2]*255))
    	

    	




def callback(event):
        print "clicked at", event.x, event.y

app = Application()                       
app.master.title('Mandelbrot set')

app.mainloop()                            