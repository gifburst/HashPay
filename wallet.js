// Load MoggyCoins from local storage
let coins = JSON.parse(localStorage.getItem('moggycoins') || '[]');
let coinList = document.getElementById('coinList');

// Add MoggyCoins to the coin list
for (let coin of coins) {
  let option = document.createElement('option');
  option.text = coin;
  coinList.add(option);
}

// Scan QR code and add to MoggyCoin list
function scanQRCode() {
  let scanInput = document.getElementById('scanInput');
  let qr = qrcode(0, 'L');
  qr.makeCode(scanInput.value);
  let scannedCoin = qr._oQRCode.modules.map(function(row) { return row.join('') }).join('');
  coins.push(scannedCoin);
  let option = document.createElement('option');
  option.text = scannedCoin;
  coinList.add(option);
  localStorage.setItem('moggycoins', JSON.stringify(coins));
}

// Clear MoggyCoin list and local storage
function clearList() {
  coins = [];
  coinList.innerHTML = '';
  localStorage.removeItem('moggycoins');
}
