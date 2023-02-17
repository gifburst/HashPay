document.addEventListener("DOMContentLoaded", function() {
  // Set up the Instascan scanner
  let scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5, mirror: false });
  scanner.addListener('scan', function (content) {
    // Handle a scanned QR code
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

  // Find and start the first available camera
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[0]);
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });

  // Bind the "Scan QR Code" button to start the scanner
  document.getElementById("scan-btn").addEventListener("click", function() {
    scanner.start();
  });

  // Display any saved coin codes on the page
  displayCoinCodes();
});

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
