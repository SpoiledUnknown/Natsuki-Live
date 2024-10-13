let blinkAnime, stareAnime;
let blushImage,
  smileImage,
  poutImage,
  rightEyeImage,
  leftEyeImage,
  bothEyesCloseImage,
  rightEyeClosed,
  leftEyeClosed,
  surprisedImage,
  currentImage;

let baseSprite, smileSprite, poutSprite, blushSprite, rightEyeSprite, leftEyeSprite, facialExpression;
let faceTrigger, leftEyeTrigger, rightEyeTrigger, headTrigger, surprisedTrigger;

let screenWidth;
let screenHeight;

let imageWidth;
let imageHeight;

let frameRates;

const maxRightEyeMovementX = 15;
const maxRightEyeMovementY = 7;

const maxLeftEyeMovementX = 5;
const maxLeftEyeMovementY = 7;

let movementSpeed = 2.5;
const easingFactor = 0.1; /* You could leave this as is or try to play with this if you want to. */
const snapThreshold = 3;

const hoverDelay = 2000;

let hoverExitTime = 0;
let havePressedNatsuki = false;

const blinkDuration = 45;
let lastBlinkFrame = 0;
let haveSentError = false;

async function loadConfig() {
  try {
    const response = await fetch("./config.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const config = await response.json();
    frameRates = config.fps;
  } catch (error) {
    console.error("Failed to load config:", error);
  }
}

// Call the function to load the config
loadConfig();

/**
 * Similar to Unity'd Awake Method
 */
function preload() {
  blinkAnime = loadAnimation(
    "./public/1.webp",
    "./public/2.webp",
    "./public/3.webp",
    "./public/3.webp",
    "./public/2.webp",
    "./public/1.webp"
  );
  stareAnime = loadAnimation("./public/1.webp");

  bothEyesCloseImage = loadImage("./public/3.webp");
  rightEyeClosed = loadImage("./public/RightEyeClosed.webp");
  leftEyeClosed = loadImage("./public/LeftEyeClosed.webp");

  smileImage = loadImage("./public/Smile.webp");
  blushImage = loadImage("./public/Blush.webp");
  poutImage = loadImage("./public/Pout.webp");

  rightEyeImage = loadImage("./public/EyeRight.webp");
  leftEyeImage = loadImage("./public/EyeLeft.webp");

  surprisedImage = loadImage("./public/surprised.webp");
}

/**
 * Similar to Unity's Start Method
 */
function setup() {
  screenWidth = windowWidth;
  screenHeight = windowHeight;

  imageWidth = smileImage.width;
  imageHeight = smileImage.height;

  createCanvas(screenWidth, screenHeight);

  let screenAspectRatio = windowWidth / windowHeight;
  let imageAspectRatio = imageWidth / imageHeight;

  let scaleFactor;
  if (screenAspectRatio > imageAspectRatio) {
    scaleFactor = windowHeight / imageHeight;
  } else {
    scaleFactor = windowWidth / imageWidth;
  }

  poutImage.resize(poutImage.width * scaleFactor, poutImage.height * scaleFactor);
  smileImage.resize(smileImage.width * scaleFactor, smileImage.height * scaleFactor);
  blushImage.resize(blushImage.width * scaleFactor, blushImage.height * scaleFactor);
  leftEyeImage.resize(leftEyeImage.width * scaleFactor, leftEyeImage.height * scaleFactor);
  rightEyeImage.resize(rightEyeImage.width * scaleFactor, rightEyeImage.height * scaleFactor);
  leftEyeClosed.resize(leftEyeClosed.width * scaleFactor, leftEyeClosed.height * scaleFactor);
  rightEyeClosed.resize(rightEyeClosed.width * scaleFactor, rightEyeClosed.height * scaleFactor);
  surprisedImage.resize(surprisedImage.width * scaleFactor, surprisedImage.height * scaleFactor);
  bothEyesCloseImage.resize(bothEyesCloseImage.width * scaleFactor, bothEyesCloseImage.height * scaleFactor);

  leftEyeSprite = createSprite(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight);
  leftEyeSprite.addImage(leftEyeImage);

  rightEyeSprite = createSprite(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight);
  rightEyeSprite.addImage(rightEyeImage);

  baseSprite = createSprite(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight);
  baseSprite.addAnimation("stare", stareAnime);
  baseSprite.scale = scaleFactor;

  smileSprite = createSprite(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight);
  smileSprite.addImage(smileImage);
  currentImage = smileImage;

  facialExpression = createSprite(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight);
  facialExpression.visible = false;

  surprisedTrigger = createSprite(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight);
  surprisedTrigger.mouseActive = true;
  surprisedTrigger.visible = false;

  faceTrigger = createSprite(screenWidth * (935 / 1366), screenHeight * (440 / 768), 250, 235);
  faceTrigger.mouseActive = true;
  faceTrigger.rotation = -45;
  faceTrigger.visible = false;

  leftEyeTrigger = createSprite(screenWidth * (800 / 1366), screenHeight * (445 / 768), 60, 60);
  leftEyeTrigger.scale = Math.min(screenWidth / 1366, screenHeight / 768);
  leftEyeTrigger.mouseActive = true;
  leftEyeTrigger.rotation = -45;
  leftEyeTrigger.visible = false;

  rightEyeTrigger = createSprite(screenWidth * (970 / 1366), screenHeight * (355 / 768), 60, 60);
  rightEyeTrigger.scale = Math.min(screenWidth / 1366, screenHeight / 768);
  rightEyeTrigger.mouseActive = true;
  rightEyeTrigger.rotation = -45;
  rightEyeTrigger.visible = false;

  headTrigger = createSprite(screenWidth * (800 / 1366), screenHeight * (214 / 768), 450, 235);
  headTrigger.scale = Math.min(screenWidth / 1366, screenHeight / 768);
  headTrigger.mouseActive = true;
  headTrigger.rotation = -45;
  headTrigger.visible = false;

  screenCenter = createSprite(screenWidth / 2, screenHeight / 2, 50, 50);
  screenCenter.mouseActive = true;
  screenCenter.visible = false;
}

/**
 * Similar to Unity's Update Method
 */
function draw() {
  EyeBlinking();
  HandleEyeAnimation();
  HandleMouthAnimation();
  HandleLeftEyeMovement();
  HandleRightEyeMovement();

  if (frameRates === 30) {
    frameRate(30);
    movementSpeed = 5;
  } else if (frameRates === 60) {
    frameRate(60);
    movementSpeed = 2.5;
  } else if (frameRates === 120) {
    frameRate(120);
    movementSpeed = 1.25;
  } else if ((frameRates > 120 || frameRates < 30) && !haveSentError) {
    console.error(
      `${frameRates}fps is not officially supported.\n And why would anyone even want a ${frameRates}fps wallpaper?`
    );
    haveSentError = true;
    frameRate(60);
    movementSpeed = 2.5;
  }
  drawSprites();
}

function HandleEyeAnimation() {
  if (headTrigger.mouseIsPressed) {
    facialExpression.visible = true;
    facialExpression.addImage(bothEyesCloseImage);
  } else if (rightEyeTrigger.mouseIsOver) {
    facialExpression.visible = true;
    facialExpression.addImage(rightEyeClosed);
  } else if (leftEyeTrigger.mouseIsOver) {
    facialExpression.visible = true;
    facialExpression.addImage(leftEyeClosed);
  } else {
    facialExpression.visible = false;
  }
}

function HandleMouthAnimation() {
  if (faceTrigger.mouseIsOver) {
    if (havePressedNatsuki) {
      currentImage = poutImage;
      hoverExitTime = millis();
    } else {
      if (millis() - hoverExitTime > hoverDelay) {
        currentImage = blushImage;
      }
    }
  } else {
    if (millis() - hoverExitTime > hoverDelay) {
      currentImage = smileImage;
      havePressedNatsuki = false;
    }

    if (surprisedTrigger.mouseIsPressed && !havePressedNatsuki) {
      currentImage = surprisedImage;
      hoverExitTime = millis();
    }
  }

  smileSprite.addImage(currentImage);

  if (faceTrigger.mouseIsPressed && !(leftEyeTrigger.mouseIsOver || rightEyeTrigger.mouseIsOver)) {
    if (havePressedNatsuki) return;
    havePressedNatsuki = true;
  }
}

function EyeBlinking() {
  if (frameCount % 360 === 0 && frameCount !== lastBlinkFrame) {
    baseSprite.addAnimation("stare", blinkAnime);
    lastBlinkFrame = frameCount;
  }

  if (frameCount >= lastBlinkFrame + blinkDuration) {
    baseSprite.addAnimation("stare", stareAnime);
  }
}

function HandleRightEyeMovement() {
  let mouseXRel = mouseX - rightEyeSprite.position.x;
  let mouseYRel = mouseY - rightEyeSprite.position.y;

  let distance = dist(0, 0, mouseXRel, mouseYRel);

  let maxDistance = Math.sqrt(maxRightEyeMovementX ** 2 + maxRightEyeMovementY ** 2);

  if (screenCenter.mouseIsOver || havePressedNatsuki || faceTrigger.mouseIsOver || leftEyeTrigger.mouseIsOver) {
    rightEyeSprite.position.x += (screenWidth / 2 - rightEyeSprite.position.x) * movementSpeed * easingFactor;
    rightEyeSprite.position.y += (screenHeight / 2 - rightEyeSprite.position.y) * movementSpeed * easingFactor;

    if (
      dist(rightEyeSprite.position.x, rightEyeSprite.position.y, screenWidth / 2, screenHeight / 2) <= snapThreshold
    ) {
      rightEyeSprite.position.x = screenWidth / 2;
      rightEyeSprite.position.y = screenHeight / 2;
    }

    return;
  }

  if (distance > 0.1) {
    if (distance > maxDistance) {
      mouseXRel = (mouseXRel / distance) * maxDistance;
      mouseYRel = (mouseYRel / distance) * maxDistance;
    }

    rightEyeSprite.position.x += mouseXRel * movementSpeed;
    rightEyeSprite.position.y += mouseYRel * movementSpeed;

    rightEyeSprite.position.x = constrain(
      rightEyeSprite.position.x,
      screenWidth / 2 - maxRightEyeMovementX,
      screenWidth / 2 + maxRightEyeMovementX
    );
    rightEyeSprite.position.y = constrain(
      rightEyeSprite.position.y,
      screenHeight / 2 - maxRightEyeMovementY,
      screenHeight / 2 + maxRightEyeMovementY
    );
  }
}

function HandleLeftEyeMovement() {
  let mouseXRel = mouseX - leftEyeSprite.position.x;
  let mouseYRel = mouseY - leftEyeSprite.position.y;

  let distance = dist(0, 0, mouseXRel, mouseYRel);

  let maxDistance = Math.sqrt(maxLeftEyeMovementX ** 2 + maxLeftEyeMovementY ** 2);

  if (screenCenter.mouseIsOver || havePressedNatsuki || faceTrigger.mouseIsOver || rightEyeTrigger.mouseIsOver) {
    leftEyeSprite.position.x += (screenWidth / 2 - leftEyeSprite.position.x) * movementSpeed * easingFactor;
    leftEyeSprite.position.y += (screenHeight / 2 - leftEyeSprite.position.y) * movementSpeed * easingFactor;

    if (dist(leftEyeSprite.position.x, leftEyeSprite.position.y, screenWidth / 2, screenHeight / 2) <= snapThreshold) {
      leftEyeSprite.position.x = screenWidth / 2;
      leftEyeSprite.position.y = screenHeight / 2;
    }

    return;
  }

  if (distance > 0.1 && !havePressedNatsuki) {
    if (distance > maxDistance) {
      mouseXRel = (mouseXRel / distance) * maxDistance;
      mouseYRel = (mouseYRel / distance) * maxDistance;
    }

    leftEyeSprite.position.x += mouseXRel * movementSpeed;
    leftEyeSprite.position.y += mouseYRel * movementSpeed;

    leftEyeSprite.position.x = constrain(
      leftEyeSprite.position.x,
      screenWidth / 2 - maxLeftEyeMovementX - 18,
      screenWidth / 2 + maxLeftEyeMovementX
    );
    leftEyeSprite.position.y = constrain(
      leftEyeSprite.position.y,
      screenHeight / 2 - maxLeftEyeMovementY,
      screenHeight / 2 + maxLeftEyeMovementY
    );
  }
}
