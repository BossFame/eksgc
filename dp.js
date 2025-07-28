var nameInput = document.getElementById("nameInput");
var photoInput = document.getElementById("photoInput");
var canvas = document.getElementById("flyerCanvas");
var ctx = canvas.getContext("2d");
var downloadBtn = document.getElementById("downloadBtn");
var baseImage = new Image();
baseImage.src = "dpflyer.png";

var userPhoto = null;

// Fixed photo box position and size
var photoBoxX = 400;
var photoBoxY = 246;
var photoBoxWidth = 279;
var photoBoxHeight = 340;

// Text box settings
var maxTextWidth = 210;
var maxFontSize = 40;
var minFontSize = 20;

baseImage.onload = function () {
  drawCanvas();
};

photoInput.addEventListener("change", function () {
  var reader = new FileReader();
  reader.onload = function (e) {
    userPhoto = new Image();
    userPhoto.onload = drawCanvas;
    userPhoto.src = e.target.result;
  };
  reader.readAsDataURL(this.files[0]);
});

// ⛔ Restrict text input to max pixel width
nameInput.addEventListener("input", function () {
  var text = nameInput.value;
  var fontSize = maxFontSize;
  var textWidth;

  do {
    ctx.font = "bold " + fontSize + "px Montserrat";
    textWidth = ctx.measureText(text).width;
    fontSize--;
  } while (textWidth > maxTextWidth && fontSize > minFontSize);

  if (textWidth > maxTextWidth) {
    nameInput.value = text.slice(0, -1);
  }

  drawCanvas();
});

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  if (userPhoto) {
    var imgAspect = userPhoto.width / userPhoto.height;
    var boxAspect = photoBoxWidth / photoBoxHeight;

    var sx, sy, sWidth, sHeight;

    if (imgAspect > boxAspect) {
      sHeight = userPhoto.height;
      sWidth = sHeight * boxAspect;
      sx = (userPhoto.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = userPhoto.width;
      sHeight = sWidth / boxAspect;
      sx = 0;
      sy = (userPhoto.height - sHeight) / 2;
    }

    ctx.drawImage(
      userPhoto,
      sx, sy, sWidth, sHeight,
      photoBoxX, photoBoxY, photoBoxWidth, photoBoxHeight
    );
  }

  var fontSize = 40;
  var maxWidth = 500;
  var textWidth;

  do {
    ctx.font = "bold " + fontSize + "px Montserrat";
    textWidth = ctx.measureText(nameInput.value).width;
    fontSize--;
  } while (textWidth > maxWidth && fontSize > 10);

  ctx.font = "bold " + fontSize + "px Montserrat";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(nameInput.value, 540, 660);

  canvas.style.display = "block";
}

downloadBtn.addEventListener("click", function () {
  drawCanvas();
  var dataURL = canvas.toDataURL("image/png");
  var a = document.createElement("a");
  a.href = dataURL;
  a.download = "my_flyer.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
