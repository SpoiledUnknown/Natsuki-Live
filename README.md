<h1 align="center">
  Natsuki Live
</h1>

<p align="center">
 <b><i>Natsuki Live</i></b> is a GPL-licensed recreation of the existing live wallpaper "Animated Natsuki" by GezzaBeat, featuring the fictional character <b>Natsuki</b> from <i>Doki Doki Literature Club Plus_ (DDLCP)</i>.
</p>

<p align="center">
  <a href="https://github.com/SpoiledUnknown/Natsuki-Live/releases">
      <img src="https://img.shields.io/github/v/release/SpoiledUnknown/Natsuki-Live?style=for-the-badge&logo=Github&color=Green">
  </a>
    <a href="https://github.com/SpoiledUnknown/Natsuki-Live/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-GPL-yellow.svg?style=for-the-badge&logo=Github&color=Green">
  </a>
 </p>

<div align="center">
  <img src="./public/Natsuki.webp" style="border-radius: 0.75rem;">
</div>

<br>

## ✨ Key Features

- 2K Textures
- DDLC "Play With Me" song
  - Hover to the left side of the wallpaper to access the menu
- Facial Expression
- 30/60 FPS support
- 100% Free
- Your own Natsuki

## How to Install

1. Install any live wallpaper app for your OS that supports Website/HTML.

> [!NOTE]
> I recommend using [Lively Wallpaper](https://github.com/rocksdanister/lively), another Free And Open Source Software _(FOSS)_. I don't provide setup support for any other wallpaper app.

2. Copy the GitHub Pages URL or download the zip from the [releases](https://github.com/SpoiledUnknown/Natsuki-Live/releases/tag/v0.6.7) and extract it to your desired location.

3. Set it inside the wallpaper app:
   1. Open **Lively Wallpaper**.
   2. Click on the plus (+) button in the top right.
   3. Select the wallpaper _(Optional)_.
   4. Enter the name and description
      - Adding a name and description helps you remember and distinguish between you other wallpapers
   5. rescale the thumbnail _(Optional)_.
      - This also helps in remembering and distinguishing.
   6. You are good to **GO!**

## How set correct Screen Resolution

### Method 1 (Easy):

1. Open the **_main.js_** file in text editor (like vscode or notepad)
2. Find and change the screen width and height to your screen's native resolution in variables

```javascript
const screenWidth = 1366;
const screenHeight = 768;
```

> [!NOTE]
> I have provided comment inside the code to make it easier for even the non-programmers.
> If you get any error feel free to contact me throuth the given below link. 3. Run and see the changes.

### Method 2 :

1. Open **_public_** folder.
2. Resize the images to your screens native resolution.
3. Find and change the screen width and height to your screen's native resolution in variables

```javascript
const screenWidth = 1366;
const screenHeight = 768;
```

> [!NOTE]
> I have provided comment inside the code to make it easier for even the non-programmers.
> If you get any error feel free to contact me throuth the given below link.

4. Just below width and height variable, change the imageWidth variable to the one you changed in Step 2.

```javascript
const imageWidth = 2548;
```

5. thats it!

> [!NOTE]
> Doesn't matter which method you use, you still have to change the following variables

```javascript
const deadZoneXMin = 665;
const deadZoneXMax = 710;
const deadZoneYMin = 368;
const deadZoneYMax = 400;
const snapThreshold = 3;
```

> Goodluck!!

## Need Help? or wanna give feedback?

For any tips and suggestions, feel free to create an issue or join the [Discord](https://discord.gg/YykdmCjzmQ) server. You can even mail me @ [Here](mailto:spoiledunknowndev@gmail.com)
