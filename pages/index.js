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

    // State to manage sidebar open/close
    const [sidebarOpened, setSidebarOpened] = useState(false);

    // Function to toggle sidebar
    const toggleSidebar = () => {
      setSidebarOpened((prev) => !prev);
    };

  const [audioFile, setAudioFile] = useState(null);
  const [cutAudio, setCutAudio] = useState(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const wavesurferRef = useRef(null);

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

      const audioUrl = URL.createObjectURL(audioFile);
      wavesurferRef.current.load(audioUrl);

      wavesurferRef.current.on('ready', () => {
        const duration = wavesurferRef.current.getDuration();
        setAudioDuration(duration);
        setEnd(duration);
      });

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

  const handleCut = async () => {
    setLoading(true); // Start loading

    try {
      await ffmpeg.load();

      ffmpeg.FS("writeFile", "input.mp3", await fetchFile(audioFile));

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
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: "audio/mp3" })
      );
      setCutAudio(url);
    } catch (error) {
      console.error("Error cutting audio:", error);
    } finally {
      setLoading(false); // Stop loading
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
    <Container style={{ textAlign: "center", padding: "80px 0", }}>
      <Button onClick={toggleSidebar} style={{position:'absolute',top:'20px',left:'20px',zIndex:'1000'}}>
        <IconMenu2 />
      </Button>
      <Sidebar opened={sidebarOpened} onClose={() => setSidebarOpened(false)} />
      <Title>Audio Cutter</Title>
      <Text mt="md">Free editor to trim and cut any audio file online</Text>
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
                zIndex: 1,
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
                zIndex: 1,
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

          <Button onClick={togglePlayPause} style={{ marginTop: '20px' }}>
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button onClick={handleCut} disabled={loading} style={{ marginLeft: '10px', marginTop: '20px' }}>
            {loading ? "Cutting..." : "Cut Audio"}
          </Button>
        </div>
      )}
      {cutAudio && (
        <div style={{ marginTop: '25px', width:'100%', display:'flex' ,justifyContent:'space-evenly' }}>
          <audio controls>
            <source src={cutAudio} type="audio/mp3" />
            Your browser does not support the audio tag.
          </audio>
          <a href={cutAudio} download="cut-audio.mp3">
            <Button variant="outline" style={{ marginTop: '10px', color:'white', backgroundColor:'#FB773C' }}>
              Download Cut Audio
            </Button>
          </a>
        </div>
      )}
    </Container>
  );
}
