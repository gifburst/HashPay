function scanQR() {
	let scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5, mirror: false });
	scanner.addListener('scan', function (content) {
		document.getElementById('scan-result').value = content;
		let coinCodes = localStorage.getItem('moggycoins');
		if (coinCodes === null) {
			coinCodes = [];
		} else {
			coinCodes = JSON.parse(coinCodes);
		}
		coinCodes.push(content);
		localStorage.setItem('moggycoins', JSON.stringify(coinCodes));
		scanner.stop();
		displayCoinCodes();
	});
	Instascan.Camera.getCameras().then(function (cameras) {
		if (cameras.length > 0) {
			scanner.start(cameras[0]);
		} else {
			console.error('No cameras found.');
		}
	}).catch(function (e) {
		console.error(e);
	});
}

function displayCoinCodes() {
	let coinCodes = localStorage.getItem('moggycoins');
	if (coinCodes !== null) {
		coinCodes = JSON.parse(coinCodes);
		let coinCodesHtml = '';
		for (let i = 0; i < coinCodes.length; i++) {
			coinCodesHtml += `<p>${coinCodes[i]}</p>`;
		}
		document.getElementById('coin-codes').innerHTML = coinCodesHtml;
	} else {
		document.getElementById('coin-codes').innerHTML = '<p>No MoggyCoin saved.</p>';
	}
}

// Display saved coin codes on page load
displayCoinCodes();
