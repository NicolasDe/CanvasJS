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

class Engine extends Platform
{
	constructor()
	{
		super();

		this.includeModules = ['module', 'module_input', 'module_renderer'];
		this.deltaTime = 0.0;

		this.AssetsTest = new Array();
	}

	LoadEngine()
	{
		Platform.PrintDebug('Engine has been loaded.');
		this.LoadModules(this.includeModules, this.OnEngineModulesLoaded.bind(this));
	}

	OnEngineModulesLoaded()
	{
		this.ObjectConstructor('input', new ModuleInput(), this);
		this.ObjectConstructor('renderer', new ModuleRenderer(), this);

		const assetsTest = ['content/shaders/ExampleVertexShader.fx', 'content/shaders/ExampleFragmentShader.fx']
		this.LoadAssets(assetsTest, 'text/plain', this.OnAssetsLoaded.bind(this));
	}

	OnAssetsLoaded(Assets)
	{
		this.AssetsTest = Assets;
		this.UpdateRenderer();
	}

	UpdateEngine()
	{
		// Something cool
	}

	UpdateRenderer()
	{
		if (this.AssetsTest.length === 0)
			return;

		const gl = this.renderer.contextGL;
		const canvas = this.renderer.context2D;

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
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		const vertShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertShader, this.AssetsTest[0]);
		gl.compileShader(vertShader);
		if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS))
			throw new Error(gl.getShaderInfoLog(vertShader));

		const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragShader, this.AssetsTest[1]);
		gl.compileShader(fragShader);
		if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS))
			throw new Error(gl.getShaderInfoLog(fragShader));

		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertShader);
		gl.attachShader(shaderProgram, fragShader);
		gl.linkProgram(shaderProgram);
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
			throw new Error(gl.getProgramInfoLog(shaderProgram));

		gl.useProgram(shaderProgram);

		const coordinatesVar = gl.getAttribLocation(shaderProgram, 'coordinates');
		gl.enableVertexAttribArray(coordinatesVar);
		gl.vertexAttribPointer(coordinatesVar, 2, gl.FLOAT, false, 0, 0);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		canvas.font = '22px Arial';
		canvas.fillStyle = 'rgba(255, 255, 255, 1.0)';
		canvas.fillText('Renderer test', 128, 64);
	}

	Tick(DeltaTime)
	{
		deltaTime = DeltaTime;
	}
};

function GetEngine()
{
	if (Platform.IsValid(window.Engine) === false)
		window.Engine = new Engine();

	return window.Engine;
};