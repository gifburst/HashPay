function scanQR() {
    const video = document.createElement('video');
    const canvasElement = document.getElementById('canvas');
    const canvas = canvasElement.getContext('2d');
    const loadingMessage = document.getElementById('loadingMessage');
    const outputContainer = document.getElementById('output');
    const outputMessage = document.getElementById('outputMessage');
    const outputData = document.getElementById('outputData');

    // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function(stream) {
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
        video.play();
        requestAnimationFrame(tick);
    });

    function tick() {
        loadingMessage.innerText = '⌛ Loading video...'
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            loadingMessage.hidden = true;
            canvasElement.hidden = false;

            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;
            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });

            if (code) {
                outputMessage.hidden = true;
                outputData.parentElement.hidden = false;
                outputData.innerText = code.data;
                let coinCodes = localStorage.getItem('moggycoins');
                if (coinCodes === null) {
                    coinCodes = [];
                } else {
                    coinCodes = JSON.parse(coinCodes);
                }
                coinCodes.push(code.data);
                localStorage.setItem('moggycoins', JSON.stringify(coinCodes));
                displayCoinCodes();
            } else {
                outputMessage.hidden = false;
                outputData.parentElement.hidden = true;
            }
        }
        requestAnimationFrame(tick);
    }
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
