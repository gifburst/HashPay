// Get references to HTML elements
const scanResultEl = document.getElementById('scan-result');
const scanBtnEl = document.getElementById('scan-qr');
const myCoinsEl = document.getElementById('my-coins');

// Define variables for QuaggaJS
let scanner = null;
const qrConstraints = {
  width: 640,
  height: 480,
  facingMode: 'environment'
};

// Define event listener for when the "Scan QR Code" button is clicked
scanBtnEl.addEventListener('click', () => {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#scanner-container'),
      constraints: qrConstraints
    },
    decoder: {
      readers: ["qrcode_reader"]
    }
  }, function(err) {
    if (err) {
      console.log(err);
      return;
    }
    scanner = Quagga.start();
    scanner.onDetected(handleQrScan);
  });
});

// Define function to handle QR code scan
function handleQrScan(result) {
  const content = result.codeResult.code;
  scanResultEl.value = content;
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
}

// Define function to display saved coin codes
function displayCoinCodes() {
  let coinCodes = localStorage.getItem('moggycoins');
  if (coinCodes !== null) {
    coinCodes = JSON.parse(coinCodes);
    let coinCodesHtml = '';
    for (let i = 0; i < coinCodes.length; i++) {
      coinCodesHtml += `<p>${coinCodes[i]}</p>`;
    }
    myCoinsEl.innerHTML = coinCodesHtml;
  } else {
    myCoinsEl.innerHTML = '<p>No MoggyCoin saved.</p>';
  }
}

// Display saved coin codes on page load
displayCoinCodes();
