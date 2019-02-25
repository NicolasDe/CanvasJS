// The MIT License (MIT)
// 
// Copyright (c) 2019 Nicolas (https://github.com/NicolasDe)
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

class ModuleRenderer extends Module
{
	constructor()
	{
		super();

		this.canvasList = [null, null];

		const rendererEnum = { 'WebGL' : 0, 'Canvas' : 1 };
		this.GetRendererType = function () { return rendererEnum; }

		const glVersionList = ['webgl2', 'webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
		this.GetWebGLVersionList = function () { return glVersionList; }

		this.webGlVersion = '';

		this.contextGL = null;
		this.context2D = null;
		this.Create();

		window.addEventListener('resize', this.ViewportSize.bind(this), false);
	}

	ViewportSize(Events)
	{
		const X = window.innerWidth;
		const Y = window.innerHeight;
		this.Update();
		this.GetViewportSize = function () { return { X, Y } };
	}

	Create()
	{
		for (let i = 0; i < this.canvasList.length; i++)
		{
			this.canvasList[i] = document.createElement('canvas');
			this.canvasList[i].id = 'canvas_layer_' + i;
			this.canvasList[i].width = window.innerWidth;
			this.canvasList[i].height = window.innerHeight;
			this.canvasList[i].async = false;
			document.body.appendChild(this.canvasList[i]);

			switch (i)
			{
				case this.GetRendererType().WebGL:
					this.CreateContextGL(this.canvasList[i]);
					break;

				case this.GetRendererType().Canvas:
					this.CreateContext2D(this.canvasList[i]);
					break;
			}
		}
	}

	CreateContextGL(CanvasLayer)
	{
		for (let i = 0; i < this.GetWebGLVersionList().length; i++)
		{
			try
			{
				this.contextGL = CanvasLayer.getContext(this.GetWebGLVersionList()[i]);
			}
			catch (Error)
			{
				Platform.PrintError(Error);
			}

			if (Platform.IsValid(this.contextGL) === true)
			{
				this.webGlVersion = this.GetWebGLVersionList()[i];
				Platform.PrintDebug('WebGL version: ' + this.webGlVersion);
				break;
			}
		}

		if (Platform.IsValid(this.contextGL) === true)
		{
			this.contextGL.enable(this.contextGL.DEPTH_TEST);
			this.contextGL.depthFunc(this.contextGL.LEQUAL);
			this.contextGL.viewport(0, 0, window.innerWidth, window.innerHeight);
			this.contextGL.clearColor(0.0, 0.0, 0.0, 1.0);
			this.contextGL.clear(this.contextGL.COLOR_BUFFER_BIT | this.contextGL.DEPTH_BUFFER_BIT | this.contextGL.STENCIL_BUFFER_BIT);

			Platform.PrintDebug('Created context: WebGL');

			if (Platform.IsValid(window.Engine))
			{
				window.Engine.UpdateRenderer();
			}

		//	this.DrawTest();
		//	this.DrawTest2();
		}
		else
		{
			Platform.PrintError('Failed to create WebGL renderer context!');
		}
	}

	CreateContext2D(CanvasLayer)
	{
		this.context2D = CanvasLayer.getContext('2d');
		if (Platform.IsValid(this.context2D) === true)
		{
			this.context2D.clearRect(0, 0, window.innerWidth, window.innerHeight);

			Platform.PrintDebug('Created context: Canvas');

		//	this.DrawTest3();

			if (Platform.IsValid(window.Engine))
			{
				window.Engine.UpdateRenderer();
			}
		}
		else
		{
			Platform.PrintError('Failed to create Canvas renderer context!');
		}
	}

	Update()
	{
		for (let i = 0; i < this.canvasList.length; i++)
		{
			if (Platform.IsValid(this.canvasList[i]) === true)
			{
				this.canvasList[i].width = window.innerWidth;
				this.canvasList[i].height = window.innerHeight;

				switch (i)
				{
					case this.GetRendererType().WebGL:
						if (Platform.IsValid(this.contextGL) === true)
						{
							this.contextGL.viewport(0, 0, window.innerWidth, window.innerHeight);
							this.contextGL.clearColor(0.0, 0.0, 0.0, 1.0);
							this.contextGL.clear(this.contextGL.COLOR_BUFFER_BIT | this.contextGL.DEPTH_BUFFER_BIT | this.contextGL.STENCIL_BUFFER_BIT);

						//	this.DrawTest();
						//	this.DrawTest2();
						}
						break;

					case this.GetRendererType().Canvas:
						if (Platform.IsValid(this.context2D) === true)
						{
							this.context2D.clearRect(0, 0, window.innerWidth, window.innerHeight);

						//	this.DrawTest3();
						}
						break;
				}

				if (Platform.IsValid(window.Engine))
				{
					window.Engine.UpdateRenderer();
				}
			}
		}
	}

	DrawTest()
	{
		const vertices = [
			// First triangle:
			1.0, 1.0,
			-1.0, 1.0,
			-1.0, -1.0,
			// Second triangle:
			-1.0, -1.0,
			1.0, -1.0,
			1.0, 1.0
		];
		const buffer = this.contextGL.createBuffer();
		this.contextGL.bindBuffer(this.contextGL.ARRAY_BUFFER, buffer);
		this.contextGL.bufferData(this.contextGL.ARRAY_BUFFER, new Float32Array(vertices), this.contextGL.STATIC_DRAW);

		const vertCode = `
		attribute vec2 coordinates;
		varying vec2 UV;

		void main(void)
		{
			UV = coordinates;
			gl_Position = vec4(coordinates, 0.0, 1.0);
		}`;

		const vertShader = this.contextGL.createShader(this.contextGL.VERTEX_SHADER);
		this.contextGL.shaderSource(vertShader, vertCode);
		this.contextGL.compileShader(vertShader);
		if (!this.contextGL.getShaderParameter(vertShader, this.contextGL.COMPILE_STATUS))
			throw new Error(this.contextGL.getShaderInfoLog(vertShader));

		const fragCode = `
		precision mediump float;
		uniform vec2 resolution;
		varying vec2 UV;

		void main(void)
		{
			gl_FragColor = vec4(UV.x / resolution.x, UV.y / resolution.y, 0.0, 1.0);
		}`;

		const fragShader = this.contextGL.createShader(this.contextGL.FRAGMENT_SHADER);
		this.contextGL.shaderSource(fragShader, fragCode);
		this.contextGL.compileShader(fragShader);
		if (!this.contextGL.getShaderParameter(fragShader, this.contextGL.COMPILE_STATUS))
			throw new Error(this.contextGL.getShaderInfoLog(fragShader));

		const shaderProgram = this.contextGL.createProgram();
		this.contextGL.attachShader(shaderProgram, vertShader);
		this.contextGL.attachShader(shaderProgram, fragShader);
		this.contextGL.linkProgram(shaderProgram);
		if (!this.contextGL.getProgramParameter(shaderProgram, this.contextGL.LINK_STATUS))
			throw new Error(this.contextGL.getProgramInfoLog(shaderProgram));

		this.contextGL.useProgram(shaderProgram);

		const coordinatesVar = this.contextGL.getAttribLocation(shaderProgram, 'coordinates');
		this.contextGL.enableVertexAttribArray(coordinatesVar);
		this.contextGL.vertexAttribPointer(coordinatesVar, 2, this.contextGL.FLOAT, false, 0, 0);

		this.contextGL.drawArrays(this.contextGL.TRIANGLES, 0, 6);
		this.contextGL.bindBuffer(this.contextGL.ARRAY_BUFFER, null);
	}

	DrawTest2()
	{
		const vertices = [
			0.0, 0.5,
			0.5, -0.5,
			-0.5, -0.5
		];
		const buffer = this.contextGL.createBuffer();
		this.contextGL.bindBuffer(this.contextGL.ARRAY_BUFFER, buffer);
		this.contextGL.bufferData(this.contextGL.ARRAY_BUFFER, new Float32Array(vertices), this.contextGL.STATIC_DRAW);

		const vertCode = `
		precision mediump float;
		attribute vec2 coordinates;
		void main(void)
		{
			gl_Position = vec4(coordinates, 0.0, 1.0);
		}`;

		const vertShader = this.contextGL.createShader(this.contextGL.VERTEX_SHADER);
		this.contextGL.shaderSource(vertShader, vertCode);
		this.contextGL.compileShader(vertShader);
		if (!this.contextGL.getShaderParameter(vertShader, this.contextGL.COMPILE_STATUS))
			throw new Error(this.contextGL.getShaderInfoLog(vertShader));

		const fragCode = `
		void main(void)
		{
			gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
		}`;

		const fragShader = this.contextGL.createShader(this.contextGL.FRAGMENT_SHADER);
		this.contextGL.shaderSource(fragShader, fragCode);
		this.contextGL.compileShader(fragShader);
		if (!this.contextGL.getShaderParameter(fragShader, this.contextGL.COMPILE_STATUS))
			throw new Error(this.contextGL.getShaderInfoLog(fragShader));

		const shaderProgram = this.contextGL.createProgram();
		this.contextGL.attachShader(shaderProgram, vertShader);
		this.contextGL.attachShader(shaderProgram, fragShader);
		this.contextGL.linkProgram(shaderProgram);
		if (!this.contextGL.getProgramParameter(shaderProgram, this.contextGL.LINK_STATUS))
			throw new Error(this.contextGL.getProgramInfoLog(shaderProgram));

		this.contextGL.useProgram(shaderProgram);

		const coordinatesVar = this.contextGL.getAttribLocation(shaderProgram, "coordinates");
		this.contextGL.enableVertexAttribArray(coordinatesVar);
		this.contextGL.vertexAttribPointer(coordinatesVar, 2, this.contextGL.FLOAT, false, 0, 0);

		this.contextGL.drawArrays(this.contextGL.TRIANGLES, 0, 3);
		this.contextGL.bindBuffer(this.contextGL.ARRAY_BUFFER, null);
	}

	DrawTest3()
	{
		this.context2D.font = '22px Arial';
		this.context2D.fillStyle = 'rgba(255, 255, 255, 1.0)';
		this.context2D.fillText('Renderer test', 128, 64);
	}
};