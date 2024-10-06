# Audio Cutter Web Application

This project is a **web-based audio cutter tool** built with Next.js and FFmpeg. The tool allows users to trim and cut audio files by adjusting the start and end times, visualizing the waveform of the audio using **WaveSurfer.js**, and then downloading the cut version of the audio.

## Features
- Upload an audio file (e.g., `.mp3`, `.wav`, etc.)
- Visualize the audio waveform with **WaveSurfer.js**
- Adjust the start and end times using sliders
- Play and pause the audio at any point
- Trim and download the cut audio using **FFmpeg**
- Responsive and styled using **Mantine UI**
- Sidebar navigation with links to Home and About pages

## Demo
A live demo of this application is available on **Vercel**:  
[Audio Cutter Web Application](https://audio-cutter-next-js.vercel.app/)

## Technologies Used
- **Next.js**: A React framework for building server-side rendered and static web applications.
- **FFmpeg**: Used for cutting/trimming the audio files.
- **WaveSurfer.js**: Audio waveform visualization library.
- **Mantine UI**: Component library for styling and responsiveness.
- **Tabler Icons**: Used for the sidebar icons.

## How to Use the Application
1. **Upload an Audio File**: Select an audio file (supported formats: `.mp3`, `.wav`, etc.) from your local machine.
2. **Adjust the Start and End Points**: Use the sliders to choose the portion of the audio file that you want to trim. You can view the audio waveform to assist with precision.
3. **Play/Pause**: Click the play/pause button to listen to the audio starting from the selected time.
4. **Cut the Audio**: Once you are satisfied with the start and end points, click the "Cut Audio" button to trim the selected portion of the audio.
5. **Download**: After processing, a download button will appear, allowing you to save the cut audio file.

## Project Setup

### Requirements
Make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Prashant1510/Audio-Cutter-Next.js-.git
