# Simple Music Player

A lightweight, browser-based audio player designed for high-precision lyric synchronization. This application processes local files directly in the browser, providing a seamless experience for playing music alongside standard or word-by-word synchronized lyric files.

## Core Features

- **Word-by-Word Synchronization**: Full support for Enhanced LRC formats. Each word highlights in real-time as it is sung, providing a precise visual guide.
- **Dynamic Metadata Retrieval**: Automatically fetches high-resolution album artwork via the iTunes Search API based on the audio file name.
- **Fallback Visuals**: Includes a default high-quality vinyl placeholder for tracks that cannot be matched via the API.
- **Interactive Navigation**: Supports audio seeking by clicking on individual words or entire lines within the lyric display.
- **Local File Processing**: Operates entirely within the client-side environment. No audio or lyric data is uploaded to external servers, ensuring user privacy.
- **Dual-Input Interface**: Supports both drag-and-drop functionality and traditional file selection buttons for music and lyric loading.
- **Fetching lyrics from LRCLIB**: Supports fetching lyrics from LRCLIB by track name, artist name and album name (you have to fill it manually)

## Usage Instructions

1. **Launch**: Open the `justarist.github.io/simple-music-player` in your web browser.
2. **Load Audio**: Drag an audio file (MP3, FLAC, etc.) into the designated "Track" zone or click "Upload Audio".
3. **Load Lyrics**: Drag a matching `.lrc` or `.ass` file into the "Lyrics" zone or click "Upload Lyrics".
4. **Playback**: Use the custom play/pause button and volume slider to control the experience.

## Technical Specifications

- **Frontend**: Pure Vanilla JavaScript.
- **Styling**: CSS using backdrop-filters, custom range inputs, and flexbox layouts.
- **APIs**: 
  - HTML5 Audio API for playback and time tracking.
  - iTunes Search API for artwork metadata.
  - File API for local file reading.
  - LRCLIB for fetching lyrics
- **Synchronization**: Uses `requestAnimationFrame` for high-frequency UI updates, ensuring smooth animations at 60 frames per second.

## Supported Formats

| Format | Level of Support |
| :--- | :--- |
| **LRC (Standard)** | Full support for line-by-line synchronization. |
| **LRC (Enhanced)** | Full support for word-by-word synchronization using `<mm:ss.xx>` tags. |
| **ASS** | Basic support for dialogue extraction and timestamping. |
| **Audio** | Any format natively supported by the browser (MP3, WAV, OGG, FLAC). |

## Design Architecture

The interface utilizes a clean, semi-transparent aesthetic to maintain focus on the content. The layout is divided into a main lyric viewing area and a sidebar for controls and file management. The typography and lighting effects are optimized for readability against varying background covers.
