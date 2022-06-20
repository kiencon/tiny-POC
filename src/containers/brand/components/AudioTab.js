import React from 'react';
import styled from 'styled-components';

import AudioPlayer from './player/CustomAudioPlayer';

const AudioTab = ({ informationAudio }) => (
  <>
    {informationAudio.map((audio, index) => (
      <WrapAudio key={audio.url}>
        <AudioPlayer
          audio={audio}
          index={index}
          length={informationAudio.length}
        />
      </WrapAudio>
    ))}
  </>
);

const WrapAudio = styled.div`
  width: 100%;
  height: 64px;
  border-radius: 4px;
  background-color: #f7f9fc;
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  padding: 20px 24px 20px 24px;
  audio {
    width: 100%;
  };
  audio::-webkit-media-controls-panel {
    background-color: #f7f9fc;
  };
  audio::-webkit-media-controls-timeline {
    background-color: #2c83eb;
    padding: 0;
    margin: 0 16px;
    position: relative;
  };
`;

export default AudioTab;
