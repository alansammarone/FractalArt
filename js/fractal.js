Fractal = function() {

	this.cWidth = 0;
	this.cHeight = 0;
	this.cPixels = [];
	this.cData = [];

	this.cID = "cvs";

	this.fPixelsPerUnit = 500 //2097152000// 	
	this.fZ = [0.285, 0.01]
	this.fCenter = [0, 0] //[-1.0389064865112305, 0.3486987857818603]//[0, 0];
	
	this.fType = 1 //1 = mandelbrot, 2 = julia

	this.fMaxIterations = 100;
	
	this.fColorScheme = 1; //1 = red espace alg., 2 = green escape alg, 3 = blue escape alg.
	this.fColorsArray = [];



	this.eCanvas = null; //canvas element
	this.cContext = null; //canvas context

	this.initializeFractal = function() {
		
		self.cWidth = window.innerWidth;
		self.cHeight = window.innerHeight;



		self.eCanvas = document.getElementById(this.cID);
		self.cContext = self.eCanvas.getContext("2d");

		self.eCanvas.width = self.cWidth;
		self.eCanvas.height = self.cHeight;

		self.cData = self.cContext.createImageData(self.cWidth, self.cHeight);


		if (self.fType == 1)
			self.fCenter = [-1.0389064865112305, 0.3486987857818603]//[-0.75, 0]

		self.buildColorSchemeArray();
		self.bindEvents();
		self.createGUI();

	}

	this.bindEvents = function() {

		
		self.eCanvas.addEventListener("click", self.clickHandler, false);
	}


	this.drawFractal = function () {
		if (self.fType == 1)
			self.cPixels = self.drawMandelbrotSet();
		else if (self.fType == 2)
			self.cPixels = self.drawJuliaSet(self.fZ);


		self.cPixels = self.gridAntialias(self.cPixels);

		self.drawOnScreen(self.cPixels);

		/*for (var i=0; i<testcases; ++i){
			t0 = Date.now()
			
			drawMandelbrot()	
			redrawScreen()
			t1 = Date.now()
			totaltime += (t1-t0)
		}*/

	}

	this.drawMandelbrotSet = function() {
		var index = 0
		var pixels = []


		var k = 0;

		for (var y=0; y<self.cHeight; ++y)

			for (var x = 0; x<self.cWidth; ++x)	
			{

				hasEscaped = false;

				_c = self.screenToMath([x, y])

				zr = _zr =  _c[0]
				zi = _zi = _c[1]

				for (var i=0; i<self.fMaxIterations; ++i)
				{
					zr = zr*zr - zi*zi + _c[0]
					zi = 2*_zr*zi + _c[1]

					_zr = zr
					

					if (zr*zr + zi*zi > 4)
					{
						
						pixels[index] = self.fColorsArray[i]
						hasEscaped = true
						break;
					}
				
				}
				if (!hasEscaped)
					pixels[index] = [255, 255, 255, 255]

		
				++index;
			}

			

			return pixels;
	}

	this.drawJuliaSet = function(fZ) {
		var index = 0
		var pixels = []
		

		for (var y=0; y<self.cHeight; ++y)

			for (var x = 0; x<self.cWidth; ++x)	
			{
				hasEscaped = false;

				_t = self.screenToMath([x, y])


				zr = _zr = _t[0]
				zi = _t[1]

				for (var i=0; i<self.fMaxIterations; ++i)
				{
					zr = zr*zr - zi*zi + fZ[0]
					zi = 2*_zr*zi + fZ[1]

					_zr = zr
					

					if (zr*zr + zi*zi > 4)
					{
						
						pixels[index] = self.fColorsArray[i]
						hasEscaped = true
						break;
					}
				
				}
				if (!hasEscaped)
					pixels[index] = [255, 255, 255, 255]

		
				++index;
			}

			
			return pixels;
	}			

	this.gridAntialias = function(pixels)
	{
		return pixels;
		for (var i=0; i<pixels.length-1; ++i)
		{
			pixels[i] = [(pixels[i][0]+pixels[i+1][0])/2,(pixels[i][1]+pixels[i+1][1])/2,(pixels[i][2]+pixels[i+1][2])/2,255]
		}
		return pixels
	}

	this.drawOnScreen = function(pixels) {

		index = 0;
		for (var y=0; y<self.cHeight; ++y)
			for (var x = 0; x<self.cWidth; ++x)
			{
			
				if (typeof pixels[index] == "undefined")
					pixels[index] = [255, 0, 0, 0]	


				cindex = index*4;
				self.cData.data[cindex] = pixels[index][0]
				self.cData.data[cindex+1] = pixels[index][1]
				self.cData.data[cindex+2] = pixels[index][2]
				self.cData.data[cindex+3] = pixels[index][3]
				
				index++;

				
			}

		self.cContext.putImageData(self.cData, 0, 0)

	}

	this.buildColorSchemeArray = function() {



		var colorIncrement = 255/self.fMaxIterations;
		var baseValue = 0;

		self.fColorsArray = []

		for (var i=0;i<self.fMaxIterations;++i) {
			baseValue = colorIncrement*i;

			if (this.fColorScheme == 1) self.fColorsArray.push([baseValue*3, baseValue, baseValue, 255]);
			if (this.fColorScheme == 2) self.fColorsArray.push([baseValue, baseValue*3, baseValue, 255]);
			if (this.fColorScheme == 3) self.fColorsArray.push([baseValue, baseValue, baseValue*3, 255]);
			if (this.fColorScheme == 4) self.fColorsArray.push([baseValue, baseValue, baseValue, 255]);

		}

		return;


		colorsArray = []
		for (var i=0; i<self.fMaxIterations; ++i)
		{
			b = i*3;
			self.fColorsArray.push([b, b, b*3, 255])
			
		}

	}

 	this.screenToMath = function(screenCoords) {

		return [(screenCoords[0] - self.cWidth/2)/self.fPixelsPerUnit + self.fCenter[0], (-screenCoords[1] + self.cHeight/2)/self.fPixelsPerUnit + self.fCenter[1]]
	}	


	this.clickHandler = function(e)
	{
		self.fCenter = self.screenToMath([e.offsetX, e.offsetY])
		self.fPixelsPerUnit *= 4
		
		
		self.drawFractal();
		return false;
	}


	this.createGUI = function()
	{

		var FizzyText = function() {
			this.fractal = '';
			
			this.zr = self.fZ[0];
			this.zi = self.fZ[1];
			this.maxIterations = self.fMaxIterations;
			this.colorScheme = self.fColorScheme
			this.antialiasing = 0;
			this.explode = function() { };
			
		};

		
		var text = new FizzyText();
		var gui = new dat.GUI();

		controllerFractal = gui.add(text, 'fractal', {'mandelbrot set':1, 'julia set':2});
		controllerZr = gui.add(text, 'zr')
		controllerZi = gui.add(text, 'zi')
		controllerZr.__truncationSuspended = true
		controllerZi.__truncationSuspended = true

		
		controllerMaxIterations = gui.add(text, 'maxIterations', 0, 150);

		controllerColorScheme = gui.add(text, 'colorScheme', {'red - escape time':1, 'green - scape time':2, 'blue - escape time':3, 'grey - escape time':4});
		controllerAntialiasing = gui.add(text, 'antialiasing', {'none':0, 'grid':1, 'jitter':2});

		gui.add(text, 'explode');


		if (self.fType == 1){
			controllerZr.domElement.parentNode.parentNode.style.display = "none"
			controllerZi.domElement.parentNode.parentNode.style.display = "none"
			//self.fCenter = [-.75, 0]
		} else if (self.fType == 2) {
			controllerZr.domElement.parentNode.parentNode.style.display = "block"
			controllerZi.domElement.parentNode.parentNode.style.display = "block"
			//self.fCenter = [0, 0]
		}


		controllerFractal.onFinishChange(function(v){
			self.fType = v;
			if (self.fType == 1){
				controllerZr.domElement.parentNode.parentNode.style.display = "none"
				controllerZi.domElement.parentNode.parentNode.style.display = "none"
				self.fCenter = [-.75, 0]
			} else if (self.fType == 2) {
				controllerZr.domElement.parentNode.parentNode.style.display = "block"
				controllerZi.domElement.parentNode.parentNode.style.display = "block"
				self.fCenter = [0, 0]
			}
			self.drawFractal();

		});

		controllerMaxIterations.onFinishChange(function(v){
			self.fMaxIterations = v;
		});

		controllerZr.onFinishChange(function(v){
			self.fZ = [v, self.fZ[1]];
			self.drawFractal();
		})

		controllerZi.onFinishChange(function(v){
			self.fZ = [self.fZ[0], v];
			self.drawFractal();
		})

		controllerColorScheme.onFinishChange(function(v){
			self.fColorScheme = v;
			self.buildColorSchemeArray()
			self.drawFractal();
		})		
		


	}

	var self = this;

}


	










