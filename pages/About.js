

import { Container, Title, Text, Button, Box } from '@mantine/core';
import Link from 'next/link';

export default function About() {
  return (
    <Container style={{ padding: '60px', maxWidth: '1000px' }}>
      <Title order={2}>About This Tool</Title>
      <Text mt="md">
        This audio cutter tool allows you to easily trim and cut any audio file online.
        You can upload your audio file, specify the start and end times, and download the trimmed audio.
      </Text>
      
      <Title order={3} mt="md">How to Use</Title>
      <Text mt="md">
        1. Upload your audio file using the "Select Audio File" button.
        <br />
        2. Adjust the start and end sliders to select the portion of the audio you want to cut.
        <br />
        3. Click on the "Cut Audio" button to process the audio.
        <br />
        4. Once done, you can listen to the cut audio and download it if desired.
      </Text>

      <Box mt="md" display="flex" justifyContent="center">
        <Link href="/">
          <Button variant="outline">Go Back</Button>
        </Link>
      </Box>
    </Container>
  );
}
