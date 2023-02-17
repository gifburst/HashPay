// Create a function to check if the device is an iPhone
function isIphone() {
  return /iPhone/.test(navigator.userAgent);
}

// Use the isIphone() function to determine whether to use front or back camera
function getCamera() {
  return isIphone() ? "front" : "back";
}

// Wrap the code in a function to execute when the document is ready
document.addEventListener("DOMContentLoaded", function(event) {
  // Check if localStorage is supported
  if (typeof(Storage) === "undefined") {
    console.log("Sorry, your browser does not support Web Storage...");
    return;
  }

  // Create a new ZXing HTML5 scanner
  let codeReader = new ZXing.BrowserBarcodeReader();
  let videoElement = document.createElement("video");
  videoElement.id = "preview";
  let scannerContainer = document.getElementById("scanner-container");
  scannerContainer.appendChild(videoElement);

  // When a QR code is scanned
  codeReader.decodeFromInputVideoDevice(getCamera(), "preview", (result, err) => {
    if (result) {
      document.getElementById("scan-result").value = result.text;
      let coinCodes = localStorage.getItem("moggycoins");
      if (coinCodes === null) {
        coinCodes = [];
      } else {
        coinCodes = JSON.parse(coinCodes);
      }
      coinCodes.push(result.text);
      localStorage.setItem("moggycoins", JSON.stringify(coinCodes));
      codeReader.reset();
      displayCoinCodes();
    } else {
      console.error(err);
    }
  });

  // Display the saved coin codes on the page
  function displayCoinCodes() {
    let coinCodes = localStorage.getItem("moggycoins");
    if (coinCodes !== null) {
      coinCodes = JSON.parse(coinCodes);
      let coinCodesHtml = "";
      for (let i = 0; i < coinCodes.length; i++) {
        coinCodesHtml += `<p>${coinCodes[i]}</p>`;
      }
      document.getElementById("coin-codes").innerHTML = coinCodesHtml;
    } else {
      document.getElementById("coin-codes").innerHTML = "<p>No MoggyCoin saved.</p>";
    }
  }

  // Call the displayCoinCodes function on page load
  displayCoinCodes();
});
