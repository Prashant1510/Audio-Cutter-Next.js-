import { RangeSlider, Group, Button } from '@mantine/core';
import { useState } from 'react';

const AudioCutter = ({ audioDuration, onCut }) => {
  const [range, setRange] = useState([0, audioDuration]);

  const handleCut = () => {
    onCut(range);
  };

  return (
    <Group direction="column" position="center">
      <RangeSlider
        min={0}
        max={audioDuration}
        value={range}
        onChange={setRange}
        label={(val) => `${val} sec`}
      />
      <Button onClick={handleCut}>Cut Audio</Button>
    </Group>
  );
};

export default AudioCutter;
