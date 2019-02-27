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

class Platform
{
	constructor()
	{
		this.engineModulesPath = 'core/js/libs/modules/';
		this.printDebug = true;
	}

	static IsValid(Object)
	{
		if (!Object || Object === null)
			return false;

		if (typeof Object === 'function' ||
			typeof Object === 'class' ||
			typeof Object === 'object' ||
			typeof Object === 'string')
			return true;

		return false;
	}

	static PathToName(Path)
	{
		const fileName = Path.substring(Path.lastIndexOf('/') + 1);
		return fileName.split('.')[0];
	}

	static PrintError(ErrorMessage)
	{
		alert(ErrorMessage);
		console.log(ErrorMessage);
	}

	static PrintDebug(DebugMessage)
	{
		if (Platform.IsValid(window.Engine))
		{
			if (window.Engine.printDebug === true)
				console.log(DebugMessage);
		}
	}

	LoadAsset(AssetPath, MimeType, OnLoadedCallback)
	{
		Platform.PrintDebug('Trying to load asset...');

		const assetName = Platform.PathToName(AssetPath);
		const loadRequest = new XMLHttpRequest();
		
		loadRequest.onreadystatechange = function ()
		{
			if (loadRequest.readyState === 4)
			{
				if (loadRequest.status === 200)
				{
					Platform.PrintDebug('Loaded asset: ' + assetName);

					if (Platform.IsValid(OnLoadedCallback))
						OnLoadedCallback.call(this, loadRequest.response);
				}
				else
				{
					const errorMsg = 'Failed to load asset: ' + assetName;
					Platform.PrintError(errorMsg);
				}
			}
		}

		loadRequest.overrideMimeType(MimeType);
		loadRequest.open('GET', AssetPath, true);

		try
		{
			loadRequest.send();
		}
		catch (Error)
		{
			Platform.PrintError('Failed to load asset file: ' + AssetPath);
		}
	}

	LoadAssets(AssetPaths, MimeType, OnLoadedCallback)
	{
		Platform.PrintDebug('Trying to load assets...');

		let validationArray = new Array(AssetPaths.length).fill(false);
		let responseList = new Array(AssetPaths.length);

		for (let i = 0; i < AssetPaths.length; i++)
		{
			const assetName = Platform.PathToName(AssetPaths[i]);
			const loadRequest = new XMLHttpRequest();
		
			loadRequest.onreadystatechange = function ()
			{
				if (loadRequest.readyState === 4)
				{
					if (loadRequest.status === 200)
					{
						Platform.PrintDebug('Loaded asset: ' + assetName);

						validationArray[i] = true;
						responseList[i] = loadRequest.response;

						if (validationArray.every(element => element === true))
						{
							Platform.PrintDebug('Requested assets have been loaded.');

							if (Platform.IsValid(OnLoadedCallback))
								OnLoadedCallback.call(this, responseList);
						}
					}
					else
					{
						const errorMsg = 'Failed to load asset: ' + assetName;
						Platform.PrintError(errorMsg);
					}
				}
			}

			loadRequest.overrideMimeType(MimeType);
			loadRequest.open('GET', AssetPaths[i], true);

			try
			{
				loadRequest.send();
			}
			catch (Error)
			{
				Platform.PrintError('Failed to load asset file: ' + AssetPaths[i]);
			}
		}
	}

	LoadPage(PagePath, OnLoadedCallback)
	{
		Platform.PrintDebug('Trying to load user page...');

		const pageName = Platform.PathToName(PagePath);
		const loadRequest = new XMLHttpRequest();
		
		loadRequest.onreadystatechange = function ()
		{
			if (loadRequest.readyState === 4)
			{
				if (loadRequest.status === 200)
				{
					Platform.PrintDebug('User page name: ' + pageName);

					/*
					const insertPage = document.createElement('script');
					insertPage.id = pageName;
					insertPage.type = 'text/javascript';
					insertPage.text = loadRequest.response;
					insertPage.async = false;
					document.body.appendChild(insertPage);
					*/
					const insertPage = document.createElement('script');
					insertPage.id = pageName;
					insertPage.type = 'text/javascript';
					insertPage.src = PagePath;
					insertPage.async = false;
					document.body.appendChild(insertPage);

					insertPage.onload = function ()
					{
						if (Platform.IsValid(OnLoadedCallback))
							OnLoadedCallback.call(this, loadRequest.response);
					}
				}
				else
				{
					const errorMsg = 'Failed to load user page: ' + pageName;
					Platform.PrintError(errorMsg);
				}
			}
		}

		loadRequest.overrideMimeType('text/javascript');
		loadRequest.open('GET', pagePath, true);

		try
		{
			loadRequest.send();
		}
		catch (Error)
		{
			Platform.PrintError('Failed to load user page file: ' + pagePath);
		}
	}

	LoadModule(ModuleName, OnLoadedCallback)
	{
		Platform.PrintDebug('Trying to load engine module...');

		const modulePath = this.engineModulesPath + ModuleName + '.js'
		const loadRequest = new XMLHttpRequest();

		loadRequest.onreadystatechange = function ()
		{
			if (loadRequest.readyState === 4)
			{
				if (loadRequest.status === 200)
				{
					Platform.PrintDebug('Engine module name: ' + ModuleName);

					const insertModule = document.createElement('script');
					insertModule.id = ModuleName;
					insertModule.type = 'text/javascript';
					insertModule.src = modulePath;
					insertModule.async = false;
					document.body.appendChild(insertModule);

					insertModule.onload = function ()
					{
						if (Platform.IsValid(OnLoadedCallback))
							OnLoadedCallback();
					}
				}
				else
				{
					const errorMsg = 'Failed to load module: ' + ModuleName;
					Platform.PrintError(errorMsg);
				}
			}
		}

		loadRequest.overrideMimeType('text/javascript');
		loadRequest.open('GET', modulePath, true);

		try
		{
			loadRequest.send();
		}
		catch (Error)
		{
			Platform.PrintError('Failed to load module file: ' + modulePath);
		}
	}

	LoadModules(ModuleNames, OnLoadedCallback)
	{
		Platform.PrintDebug('Trying to load engine modules...');

		let validationArray = new Array(ModuleNames.length).fill(false);

		for (let i = 0; i < ModuleNames.length; i++)
		{
			const modulePath = this.engineModulesPath + ModuleNames[i] + '.js'
			const loadRequest = new XMLHttpRequest();

			loadRequest.onreadystatechange = function ()
			{
				if (loadRequest.readyState === 4)
				{
					if (loadRequest.status === 200)
					{
						Platform.PrintDebug('Engine module name: ' + ModuleNames[i]);

						const insertModule = document.createElement('script');
						insertModule.id = ModuleNames[i];
						insertModule.type = 'text/javascript';
						insertModule.src = modulePath;
						insertModule.async = false;
						document.body.appendChild(insertModule);

						insertModule.onload = function ()
						{
							validationArray[i] = true;

							if (validationArray.every(element => element === true))
							{
								Platform.PrintDebug('Requested modules have been loaded.');

								if (Platform.IsValid(OnLoadedCallback))
									OnLoadedCallback();
							}
						}
					}
					else
					{
						const errorMsg = 'Failed to load module: ' + ModuleNames[i];
						Platform.PrintError(errorMsg);
					}
				}
			}

			loadRequest.overrideMimeType('text/javascript');
			loadRequest.open('GET', modulePath, true);

			try
			{
				loadRequest.send();
			}
			catch (Error)
			{
				Platform.PrintError('Failed to load module file: ' + modulePath);
			}
		}
	}

	ObjectConstructor(ObjectName, NewObject, ObjectOwner)
	{
		if (!Platform.IsValid(ObjectName))
		{
			Platform.PrintError('ObjectConstructor: ObjectName must be a valid string!');
			return;
		}

		if (!Platform.IsValid(NewObject))
		{
			Platform.PrintError('ObjectConstructor: NewObject must be a valid object!');
			return;
		}

		if (!Platform.IsValid(ObjectOwner))
		{
			Platform.PrintError('ObjectConstructor: ObjectOwner must be a valid object!');
			return;
		}

		if (Platform.IsValid(ObjectOwner[ObjectName]))
		{
			Platform.PrintError('ObjectConstructor: ' + ObjectName + ' already exists!');
			return;
		}

		ObjectOwner[ObjectName] = NewObject;
	}
};