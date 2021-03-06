(function () {
	'use strict';

	const ipcRenderer = require('electron').ipcRenderer;
	const splash = document.getElementById('splash');
	const opening = document.getElementById('opening');
	const openingUrl = document.getElementById('opening-url');
	const webview = document.createElement('webview');

	const loadBtn = document.getElementById('load-btn');
	const minimizeBtn = document.getElementById('minimize-btn');
	const maximizeBtn = document.getElementById('maximize-btn');
	const closeBtn = document.getElementById("close-btn");

	loadBtn.addEventListener('click', () => {
		ipcRenderer.send('open-menu');
	});

	minimizeBtn.addEventListener('click', () => {
		ipcRenderer.send('window-minimize');
	});

	maximizeBtn.addEventListener('click', () => {
		ipcRenderer.send('window-maximize');
	});

	closeBtn.addEventListener('click', () => {
		ipcRenderer.send('window-close');
	});

	let revealTimeout;
	webview.addEventListener('dom-ready', () => {
		clearTimeout(revealTimeout);
		revealTimeout = setTimeout(() => {
			opening.classList.add('hidden');
			webview.style.opacity = 1;
		}, 500);
	});
	webview.setAttribute('allowpopups', 'true');
	document.body.appendChild(webview);

	ipcRenderer.send('loadMostRecentUrl');

	const showSplashTimeout = setTimeout(() => {
		splash.classList.remove('hidden');
	}, 250);

	let loadedUrl;
	ipcRenderer.on('loadUrl', (event, url) => {
		if (loadedUrl === url) {
			console.log('not loading url into webview, already loaded:', url);
			return;
		}

		console.log('loading new url into webview:', url);
		clearTimeout(showSplashTimeout);
		splash.classList.add('hidden');
		webview.style.opacity = 0;
		opening.classList.remove('hidden');
		openingUrl.innerText = url;
		webview.src = url;
		loadedUrl = url;
		document.title = `NodeCG Dashboard - ${url}`;
	});
})();
