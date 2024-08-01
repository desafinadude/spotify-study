![Spotify Study](spotify-study-128.png)
# Spotify Study

Change the tempo and add markers to Spotify tracks

![Spotify Study in action](screenshot.png)

# Installation

This is currently an unpacked chrome extension. To install, enable **Developer Mode** in Chrome (or compatible browser) and Select **LOAD UNPACKED**.

## Usage
---

To get started. Press the **Academic Cap** next to the volume slider.

`-` : Slow down

`+` : Speed up

`*` : Reset speed to 1.0x

`0` : Add section (adds section at currentTime with a length of 5 seconds)

`Del` : Delete current section

`LeftArrow` : Adjust playing section start time by -0.1 seconds

`RightArrow` : Adjust playing section start time by +0.1 seconds

`UpArrow` : Adjust playing section end time by +0.1 seconds

`DownArrow` : Adjust playing section end time by -0.1 seconds

## Issues
---
- When changing tracks, Press the **Academic Cap** again to re-activate.
- You must have a track active in the spotify player. 
- Pressing play on a marker will only work if you've pressed play at least once on the actual player. (FIX 1.0)

## RoadMap
---

#### 1.0
- List all available tracks
- Init Spotify Study without reload
- Mobile support

## Credit
---
Built on the great work here: https://github.com/intOrfloat/spotitySpeedExtension