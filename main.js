let blinkAnime, stareAnime;
let blushImage,
  smileImage,
  poutImage,
  rightEyeImage,
  leftEyeImage,
  bothEyesCloseImage,
  rightEyeClosed,
  leftEyeClosed,
  currentImage;

let baseSprite, smileSprite, poutSprite, blushSprite, rightEyeSprite, leftEyeSprit, facialExpression;
let faceTrigger, leftEyeTrigger, rightEyeTrigger, headTrigger;

const screenWidth = 1366;
const screenHeight = 768;

const maxRightEyeMovementX = 15;
const maxRightEyeMovementY = 7;

const maxLeftEyeMovementX = 5;
const maxLeftEyeMovementY = 7;

const easingFactor = 0.1;
const movementSpeed = 2.5;
const snapThreshold = 3;

const deadZoneXMin = 665;
const deadZoneXMax = 710;

const deadZoneYMin = 368;
const deadZoneYMax = 400;

const hoverDelay = 2000;

let hoverExitTime = 0;
let havePressedNatsuki = false;

const blinkDuration = 45;
let lastBlinkFrame = 0;

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
}

function setup() {
  createCanvas(screenWidth, screenHeight);

  smileImage.resize(screenWidth, screenHeight);
  blushImage.resize(screenWidth, screenHeight);
  poutImage.resize(screenWidth, screenHeight);
  rightEyeImage.resize(screenWidth, screenHeight);
  leftEyeImage.resize(screenWidth, screenHeight);
  bothEyesCloseImage.resize(screenWidth, screenHeight);
  rightEyeClosed.resize(screenWidth, screenHeight);
  leftEyeClosed.resize(screenWidth, screenHeight);

  leftEyeSprit = createSprite(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight);

  leftEyeSprit.addImage(leftEyeImage);

  rightEyeSprite = createSprite(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight);
  rightEyeSprite.addImage(rightEyeImage);

  baseSprite = createSprite(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight);
  baseSprite.addAnimation("stare", stareAnime);
  baseSprite.scale = screenWidth / 2548;

  smileSprite = createSprite(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight);
  smileSprite.addImage(smileImage);
  currentImage = smileImage;

  facialExpression = createSprite(screenWidth / 2, screenHeight / 2, screenWidth, screenHeight);
  facialExpression.visible = false;

  faceTrigger = createSprite(screenWidth / 2 + 225, screenHeight / 2 + 100, 150, 150);
  faceTrigger.mouseActive = true;
  faceTrigger.visible = false;

  leftEyeTrigger = createSprite(screenWidth / 2 + 115, screenHeight / 2 + 75, 50, 50);
  leftEyeTrigger.mouseActive = true;
  leftEyeTrigger.visible = false;

  rightEyeTrigger = createSprite(screenWidth / 2 + 280, screenHeight / 2 - 10, 60, 60);
  rightEyeTrigger.mouseActive = true;
  rightEyeTrigger.visible = false;

  headTrigger = createSprite(screenWidth / 2 + 150, screenHeight / 2 - 170, 350, 200);
  headTrigger.mouseActive = true;
  headTrigger.visible = false;
}

function draw() {
  background(100);
  frameRate(60);
  drawSprites();

  Blink();
  HandleMoutAnimation();
  HandleLeftEyeMovement();
  HandleRightEyeMovement();
  HandleEyeAnimation();
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

function HandleMoutAnimation() {
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
  }

  smileSprite.addImage(currentImage);

  if (faceTrigger.mouseIsPressed && !(leftEyeTrigger.mouseIsOver || rightEyeTrigger.mouseIsOver)) {
    if (havePressedNatsuki) return;
    havePressedNatsuki = true;
  }
}

function Blink() {
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

  if (
    (mouseX > deadZoneXMin && mouseX < deadZoneXMax && mouseY > deadZoneYMin && mouseY < deadZoneYMax) ||
    havePressedNatsuki ||
    faceTrigger.mouseIsOver ||
    leftEyeTrigger.mouseIsOver
  ) {
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
  let mouseXRel = mouseX - leftEyeSprit.position.x;
  let mouseYRel = mouseY - leftEyeSprit.position.y;

  let distance = dist(0, 0, mouseXRel, mouseYRel);

  let maxDistance = Math.sqrt(maxLeftEyeMovementX ** 2 + maxLeftEyeMovementY ** 2);

  if (
    (mouseX > deadZoneXMin && mouseX < deadZoneXMax && mouseY > deadZoneYMin && mouseY < deadZoneYMax) ||
    havePressedNatsuki ||
    faceTrigger.mouseIsOver ||
    rightEyeTrigger.mouseIsOver
  ) {
    leftEyeSprit.position.x += (screenWidth / 2 - leftEyeSprit.position.x) * movementSpeed * easingFactor;
    leftEyeSprit.position.y += (screenHeight / 2 - leftEyeSprit.position.y) * movementSpeed * easingFactor;

    if (dist(leftEyeSprit.position.x, leftEyeSprit.position.y, screenWidth / 2, screenHeight / 2) <= snapThreshold) {
      leftEyeSprit.position.x = screenWidth / 2;
      leftEyeSprit.position.y = screenHeight / 2;
    }

    return;
  }

  if (distance > 0.1 && !havePressedNatsuki) {
    if (distance > maxDistance) {
      mouseXRel = (mouseXRel / distance) * maxDistance;
      mouseYRel = (mouseYRel / distance) * maxDistance;
    }

    leftEyeSprit.position.x += mouseXRel * movementSpeed;
    leftEyeSprit.position.y += mouseYRel * movementSpeed;

    leftEyeSprit.position.x = constrain(
      leftEyeSprit.position.x,
      screenWidth / 2 - maxLeftEyeMovementX - 18,
      screenWidth / 2 + maxLeftEyeMovementX
    );
    leftEyeSprit.position.y = constrain(
      leftEyeSprit.position.y,
      screenHeight / 2 - maxLeftEyeMovementY,
      screenHeight / 2 + maxLeftEyeMovementY
    );
  }
}
