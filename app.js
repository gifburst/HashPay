// Create a function to check if the device is an iPhone
function isIphone() {
  return /iPhone/.test(navigator.userAgent);
}

// Use the isIphone() function to determine whether to use front or back camera
function getCamera() {
  return isIphone() ? Instascan.Camera.FACING_FRONT : Instascan.Camera.FACING_BACK;
}

// Wrap the code in a function to execute when the document is ready
$(document).ready(function() {
  // Check if localStorage is supported
  if (typeof(Storage) === "undefined") {
    console.log("Sorry, your browser does not support Web Storage...");
    return;
  }

  // Create a new Instascan scanner
  let scanner = new Instascan.Scanner({
    video: document.getElementById('preview'),
    scanPeriod: 5,
    mirror: false,
    facingMode: getCamera() // Use the front camera for iPhones
  });

  // When a QR code is scanned
  scanner.addListener('scan', function(content) {
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

  // Get the available cameras and start scanning
  Instascan.Camera.getCameras().then(function(cameras) {
    if (cameras.length > 0) {
      let camera = cameras[0];
      if (cameras.length === 2 && isIphone()) {
        camera = cameras[1]; // Use the back camera for iPhones if available
      }
      scanner.start(camera);
    } else {
      console.error('No cameras found.');
    }
  }).catch(function(e) {
    console.error(e);
  });

  // Display the saved coin codes on the page
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

  // Call the displayCoinCodes function on page load
  displayCoinCodes();
});
