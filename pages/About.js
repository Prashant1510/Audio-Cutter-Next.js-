

import { Container, Title, Text, Button, Box } from '@mantine/core';
import Link from 'next/link';

export default function About() {
  return (
    <Container style={{ padding: '50px', maxWidth: '1000px', marginTop:'20px' }}>
      <Title order={2} style={{fontSize:'35px'}}>About This Tool</Title>
      <Text mt="lg" style={{fontSize:'20px'}}>
        This audio cutter tool allows you to easily trim and cut any audio file online.
        You can upload your audio file, specify the start and end times, and download the trimmed audio.
      </Text>
      
      <Title order={3} mt="lg" style={{fontSize:'35px'}}>How to Use</Title>
      <Text mt="lg" style={{fontSize:'20px'}}>
        1. Upload your audio file using the "Select Audio File" button.
        <br />
        2. Adjust the start and end sliders to select the portion of the audio you want to cut.
        <br />
        3. Click on the "Cut Audio" button to process the audio.
        <br />
        4. Once done, you can listen to the cut audio and download it if desired.
        <br />
        5. Tap on any part of the waveform to play tha audio from that portion.
        <br />
        6. Trim the audio to focus on desired output.
        <br />
        <span style={{color:'red'}}>Note:</span> Due to using free hosting, this site may work slow. <span style={{color:'orange'}}>I can build the complete site but i need more time</span>
      </Text>

      <Box mt="md" display="flex" justifyContent="center">
        <Link href="/">
          <Button variant="outline">Go Back</Button>
        </Link>
      </Box>
    </Container>
  );
}
