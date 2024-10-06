import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

const Waveform = ({ audioFile }) => {
  const waveformRef = useRef(null);

  useEffect(() => {
    if (audioFile && waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#A0A0A0',
        progressColor: '#4D90FE',
        height: 100,
      });

      const reader = new FileReader();
      reader.onload = function (event) {
        wavesurfer.loadBlob(new Blob([event.target.result]));
      };
      reader.readAsArrayBuffer(audioFile);

      return () => wavesurfer.destroy();
    }
  }, [audioFile]);

  return <div ref={waveformRef}></div>;
};

export default Waveform;
