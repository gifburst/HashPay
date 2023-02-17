function displayCoinCodes() {
  let coinCodes = localStorage.getItem('moggycoins');
  if (coinCodes !== null) {
    coinCodes = JSON.parse(coinCodes);
    let coinCodesHtml = '';
    for (let i = 0; i < coinCodes.length; i++) {
      coinCodesHtml += `<p class="coin-code">${coinCodes[i]}</p>`;
    }
    document.getElementById('coin-codes').innerHTML = coinCodesHtml;
  } else {
    document.getElementById('coin-codes').innerHTML = '<p>No MoggyCoin saved.</p>';
  }
}

displayCoinCodes();

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('coin-code')) {
    const qrCode = event.target.textContent;
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div class="modal-background">
        <div class="modal">
          <div id="qrcode"></div>
          <div id="timer">30 seconds left</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const qr = new QRCode(document.getElementById('qrcode'), qrCode);
    let timeLeft = 30;
    const timer = setInterval(function () {
      timeLeft--;
      document.getElementById('timer').textContent = timeLeft + ' seconds left';
      if (timeLeft === 0) {
        clearInterval(timer);
        document.body.removeChild(modal);
        const coinCodes = JSON.parse(localStorage.getItem('moggycoins'));
        const index = coinCodes.indexOf(qrCode);
        if (index > -1) {
          coinCodes.splice(index, 1);
        }
        localStorage.setItem('moggycoins', JSON.stringify(coinCodes));
        displayCoinCodes();
      }
    }, 1000);
  }
});

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

