function generateQRCode(coinCode) {
  let qrCodeHtml = `
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">MoggyCoin QR Code</h5>
        <div id="qrcode-${coinCode}"></div>
        <div class="text-center mt-3" id="timer-${coinCode}"></div>
      </div>
    </div>
  `;
  document.getElementById('coin-codes').innerHTML = qrCodeHtml + document.getElementById('coin-codes').innerHTML;
  new QRCode(document.getElementById(`qrcode-${coinCode}`), coinCode);

  let timer = 30;
  let intervalId = setInterval(() => {
    if (timer <= 0) {
      clearInterval(intervalId);
      let coinCodes = JSON.parse(localStorage.getItem('moggycoins'));
      let index = coinCodes.indexOf(coinCode);
      if (index !== -1) {
        coinCodes.splice(index, 1);
        localStorage.setItem('moggycoins', JSON.stringify(coinCodes));
      }
      document.getElementById(`qrcode-${coinCode}`).parentNode.parentNode.remove();
    } else {
      document.getElementById(`timer-${coinCode}`).innerText = `This code will delete itself in ${timer} seconds.`;
    }
    timer--;
  }, 1000);
}

document.getElementById('coin-codes').addEventListener('click', event => {
  if (event.target.tagName === 'P') {
    generateQRCode(event.target.innerText);
  }
});
