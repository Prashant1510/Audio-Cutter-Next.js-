import { useState, useEffect, useRef } from "react";
import {
  Button,
  Container,
  Text,
  Title,
  Group,
  FileInput,
  Box,
  Slider,
} from "@mantine/core";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import WaveSurfer from "wavesurfer.js";
import { IconMenu2 } from '@tabler/icons-react';
import Sidebar from "../components/Sidebar";

const ffmpeg = createFFmpeg({
  corePath: "/ffmpeg-core.js",
  wasmPath: "/ffmpeg-core.wasm",
  log: true,
});

// Helper function to format seconds into MM:SS
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export default function Home() {
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [audioFile, setAudioFile] = useState(null); // Original or latest trimmed audio file
  const [cutAudio, setCutAudio] = useState(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null); // Store trimmed audio blob for future trimming
  const wavesurferRef = useRef(null);

  const toggleSidebar = () => setSidebarOpened((prev) => !prev);

  const loadAudioIntoWaveSurfer = (audio) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.load(URL.createObjectURL(audio));
      wavesurferRef.current.on('ready', () => {
        const duration = wavesurferRef.current.getDuration();
        setAudioDuration(duration);
        setStart(0);
        setEnd(duration);
      });
    }
  };

  // Handle file input change
  useEffect(() => {
    if (audioFile) {
      // Initialize Wavesurfer
      wavesurferRef.current = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#ddd',
        progressColor: '#4caf50',
        barWidth: 2,
        height: 100,
        normalize: true,
        responsive: true,
      });
      loadAudioIntoWaveSurfer(audioFile);

      return () => {
        wavesurferRef.current.destroy();
      };
    }
  }, [audioFile]);

  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.on('audioprocess', () => {
        const currentTime = wavesurferRef.current.getCurrentTime();
        setCurrentTime(currentTime);
        if (currentTime >= end) {
          wavesurferRef.current.pause();
          setIsPlaying(false);
        }
      });
    }
  }, [end]);

  // Watch for changes to audioBlob and reload WaveSurfer if audio is trimmed
  useEffect(() => {
    if (audioBlob) {
      loadAudioIntoWaveSurfer(audioBlob);
    }
  }, [audioBlob]);

// Cutting audio
const handleCut = async () => {
  if (wavesurferRef.current) {
    wavesurferRef.current.pause(); // Pause the audio before cutting
    setIsPlaying(false); // Update the play state
  }

  setLoading(true);
  try {
    // Check if FFmpeg is already loaded
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }

    const currentAudioFile = audioBlob ? audioBlob : audioFile;
    ffmpeg.FS("writeFile", "input.mp3", await fetchFile(currentAudioFile));

    await ffmpeg.run(
      "-i",
      "input.mp3",
      "-ss",
      `${start}`,
      "-to",
      `${end}`,
      "-c",
      "copy",
      "output.mp3"
    );

    const data = ffmpeg.FS("readFile", "output.mp3");
    const url = URL.createObjectURL(new Blob([data.buffer], { type: "audio/mp3" }));
    setCutAudio(url);
  } catch (error) {
    console.error("Error cutting audio:", error);
  } finally {
    setLoading(false);
  }
};


  // Trimming audio
  const handleTrim = async () => {
    setLoading(true);
    setIsPlaying(false);
    try {
      // Check if FFmpeg is already loaded
      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      const currentAudioFile = audioBlob ? audioBlob : audioFile;
      ffmpeg.FS("writeFile", "input.mp3", await fetchFile(currentAudioFile));

      await ffmpeg.run(
        "-i",
        "input.mp3",
        "-ss",
        `${start}`,
        "-to",
        `${end}`,
        "-c",
        "copy",
        "trimmed.mp3"
      );

      const data = ffmpeg.FS("readFile", "trimmed.mp3");
      const trimmedBlob = new Blob([data.buffer], { type: "audio/mp3" });

      // Update the state with the new trimmed audio
      setAudioBlob(trimmedBlob); // Store trimmed audio for future cuts or trims
      setAudioFile(new File([trimmedBlob], "trimmed.mp3", { type: "audio/mp3" }));

      // Reset start and end to full length of the new trimmed audio
      const newDuration = wavesurferRef.current.getDuration();
      setStart(0);
      setEnd(newDuration);

      loadAudioIntoWaveSurfer(trimmedBlob); // Reload Wavesurfer with trimmed audio
    } catch (error) {
      console.error("Error trimming audio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbDrag = (thumb, newValue) => {
    const newDuration = wavesurferRef.current.getDuration();

    if (thumb === "start") {
      setStart(Math.min(newValue, end));
      if (wavesurferRef.current && isPlaying) {
        wavesurferRef.current.seekTo(newValue / newDuration);
      }
    } else {
      setEnd(Math.max(newValue, start));
      if (wavesurferRef.current && isPlaying) {
        wavesurferRef.current.seekTo(newValue / newDuration);
      }
    }
  };

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.seekTo(start / audioDuration);
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Container style={{ textAlign: "center", padding: "80px 0" }}>
      <Button onClick={toggleSidebar} style={{ position: 'absolute', top: '20px', left: '20px', zIndex: '1000' }}>
        <IconMenu2 />
      </Button>
      <Sidebar opened={sidebarOpened} onClose={() => setSidebarOpened(false)} />
      <Title style={{ fontSize: '40px' }}>Audio Cutter</Title>
      <Text mt="md" style={{ fontSize: '30px' }}>Free editor to trim and cut any audio file online</Text>
      <Group position="center" mt="xl">
        <FileInput
          placeholder="Select Audio File"
          value={audioFile}
          onChange={setAudioFile}
          accept="audio/*"
          style={{ flex: 1 }}
        />
      </Group>
      {audioFile && (
        <div style={{ marginTop: '20px' }}>
          <div id="waveform" style={{ position: 'relative', margin: '20px auto', width: '100%' }}>
            {/* Start Line */}
            <div
              style={{
                position: 'absolute',
                left: `${(start / audioDuration) * 100}%`,
                height: '100%',
                width: '2px',
                backgroundColor: 'red',
                zIndex: 200,
              }}
            />
            {/* End Line */}
            <div
              style={{
                position: 'absolute',
                left: `${(end / audioDuration) * 100}%`,
                height: '100%',
                width: '2px',
                backgroundColor: 'blue',
                zIndex: 200,
              }}
            />
          </div>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
            <div>
              <Text>{formatTime(start)}</Text>
              <Text size="sm">Start Time</Text>
            </div>
            <div>
              <Text>{formatTime(currentTime)}</Text>
              <Text size="sm">Current Time</Text>
            </div>
            <div>
              <Text>{formatTime(end)}</Text>
              <Text size="sm">End Time</Text>
            </div>
            <div>
              <Text>{formatTime(audioDuration)}</Text>
              <Text size="sm">Total Duration</Text>
            </div>
          </Box>

          <Slider
            value={start}
            min={0}
            max={audioDuration}
            onChange={(value) => handleThumbDrag("start", value)}
            style={{ marginTop: '20px' }}
            label={null}
          />

          <Slider
            value={end}
            min={0}
            max={audioDuration}
            onChange={(value) => handleThumbDrag("end", value)}
            style={{ marginTop: '20px' }}
            label={null}
          />

          <Button onClick={togglePlayPause} style={{ marginTop: '20px', borderRadius: '5px' , backgroundColor:'#41B3A2' }}>
            {isPlaying ? "Pause" : "Play"}
          </Button>

          <Button onClick={handleCut} style={{ marginTop: '20px', marginLeft: '10px', borderRadius: '5px', backgroundColor:'#41B3A2' }} disabled={loading}>
            Cut Audio
          </Button>
          <Button onClick={handleTrim} style={{ marginTop: '20px', marginLeft: '10px', borderRadius: '5px', backgroundColor:'#41B3A2' }} disabled={loading}>
            Trim Audio
          </Button>

          {cutAudio && (
            <div style={{ marginTop: '25px', width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
              <audio controls src={cutAudio} />
              <a href={cutAudio} download="cut-audio.mp3">
                <Button variant="outline" style={{ marginTop: '10px', color: 'white', backgroundColor: '#FB773C' }}>
                  Download Cut Audio
                </Button>
              </a>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}
