let baseImage, blushImage, poutImage, rightEyeImage, leftEyeImage, currentImage;
let baseBody, rightEye, leftEye, face;

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

function preload() {
  baseImage = loadImage("./public/Look.webp");
  blushImage = loadImage("./public/Blush.webp");
  poutImage = loadImage("./public/Pout.webp");
  rightEyeImage = loadImage("./public/RightEye.webp");
  leftEyeImage = loadImage("./public/LeftEye.webp");
}

function setup() {
  createCanvas(1366, 768);

  baseImage.resize(1366, 800);
  blushImage.resize(1366, 800);
  poutImage.resize(1366, 800);
  rightEyeImage.resize(1366, 800);
  leftEyeImage.resize(1366, 800);

  leftEye = createSprite(1366 / 2, 768 / 2, 1366, 768);
  leftEye.addImage(leftEyeImage);

  rightEye = createSprite(1366 / 2, 768 / 2, 1366, 768);
  rightEye.addImage(rightEyeImage);

  baseBody = createSprite(1366 / 2, 768 / 2, 1366, 768);
  baseBody.addImage(baseImage);
  currentImage = baseImage;

  face = createSprite(900, 450, 275, 275);
  face.mouseActive = true;
  face.visible = false;
}

function draw() {
  background(100);
  frameRate(60);
  drawSprites();

  if (face.mouseIsOver) {
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
      currentImage = baseImage;
      havePressedNatsuki = false;
    }
  }

  baseBody.addImage(currentImage);

  HandleRightEyeMovement();
  HandleLeftEyeMovement();

  if (face.mouseIsPressed) {
    if (havePressedNatsuki) return;
    havePressedNatsuki = true;
  }
}

function HandleRightEyeMovement() {
  let mouseXRel = mouseX - rightEye.position.x;
  let mouseYRel = mouseY - rightEye.position.y;

  let distance = dist(0, 0, mouseXRel, mouseYRel);

  let maxDistance = Math.sqrt(
    maxRightEyeMovementX ** 2 + maxRightEyeMovementY ** 2
  );

  if (
    (mouseX > deadZoneXMin &&
      mouseX < deadZoneXMax &&
      mouseY > deadZoneYMin &&
      mouseY < deadZoneYMax) ||
    havePressedNatsuki
  ) {
    rightEye.position.x +=
      (1366 / 2 - rightEye.position.x) * movementSpeed * easingFactor;
    rightEye.position.y +=
      (768 / 2 - rightEye.position.y) * movementSpeed * easingFactor;

    if (
      dist(rightEye.position.x, rightEye.position.y, 1366 / 2, 768 / 2) <=
      snapThreshold
    ) {
      rightEye.position.x = 1366 / 2;
      rightEye.position.y = 768 / 2;
    }

    return;
  }

  if (distance > 0.1) {
    if (distance > maxDistance) {
      mouseXRel = (mouseXRel / distance) * maxDistance;
      mouseYRel = (mouseYRel / distance) * maxDistance;
    }

    rightEye.position.x += mouseXRel * movementSpeed;
    rightEye.position.y += mouseYRel * movementSpeed;

    rightEye.position.x = constrain(
      rightEye.position.x,
      1366 / 2 - maxRightEyeMovementX,
      1366 / 2 + maxRightEyeMovementX
    );
    rightEye.position.y = constrain(
      rightEye.position.y,
      768 / 2 - maxRightEyeMovementY,
      768 / 2 + maxRightEyeMovementY
    );
  }
}

function HandleLeftEyeMovement() {
  let mouseXRel = mouseX - leftEye.position.x;
  let mouseYRel = mouseY - leftEye.position.y;

  let distance = dist(0, 0, mouseXRel, mouseYRel);

  let maxDistance = Math.sqrt(
    maxLeftEyeMovementX ** 2 + maxLeftEyeMovementY ** 2
  );

  if (
    (mouseX > deadZoneXMin &&
      mouseX < deadZoneXMax &&
      mouseY > deadZoneYMin &&
      mouseY < deadZoneYMax) ||
    havePressedNatsuki
  ) {
    leftEye.position.x +=
      (1366 / 2 - leftEye.position.x) * movementSpeed * easingFactor;
    leftEye.position.y +=
      (768 / 2 - leftEye.position.y) * movementSpeed * easingFactor;

    if (
      dist(leftEye.position.x, leftEye.position.y, 1366 / 2, 768 / 2) <=
      snapThreshold
    ) {
      leftEye.position.x = 1366 / 2;
      leftEye.position.y = 768 / 2;
    }

    return;
  }

  if (distance > 0.1 && !havePressedNatsuki) {
    if (distance > maxDistance) {
      mouseXRel = (mouseXRel / distance) * maxDistance;
      mouseYRel = (mouseYRel / distance) * maxDistance;
    }

    leftEye.position.x += mouseXRel * movementSpeed;
    leftEye.position.y += mouseYRel * movementSpeed;

    leftEye.position.x = constrain(
      leftEye.position.x,
      1366 / 2 - maxLeftEyeMovementX - 18,
      1366 / 2 + maxLeftEyeMovementX
    );
    leftEye.position.y = constrain(
      leftEye.position.y,
      768 / 2 - maxLeftEyeMovementY,
      768 / 2 + maxLeftEyeMovementY
    );
  }
}
