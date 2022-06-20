import React, { useState } from 'react';
import styled from 'styled-components';
import VideoCarousel from './carousel/VideoCarousel';
import { secondsToMinutes } from '../utils/func';

const VideoGrid = ({ informationVideo }) => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isShowCarouselModal, setShowCarouselModal] = useState(false);
  const getThumbnailUrl = video => video.metadata.url;
  const getLabel = video => video.metadata.label;

  const openCarouselModal = index => {
    setCurrentVideo(index);
    setShowCarouselModal(true);
  };

  return (
    <section id="video-tab">
      {informationVideo.map((video, index) => (
        <WrapVideo
          key={video.url}
          onClick={() => openCarouselModal(index)}
        >
          <img
            src={getThumbnailUrl(video)}
            width={152}
            height={85}
            alt={getLabel(video)}
          />
          <LabelVideo>{secondsToMinutes(video.metadata.duration)}</LabelVideo>
        </WrapVideo>
      ))}
      <VideoCarousel
        videos={informationVideo}
        currentVideo={currentVideo}
        setCurrentVideo={setCurrentVideo}
        isShowCarouselModal={isShowCarouselModal}
        setShowCarouselModal={setShowCarouselModal}
        getThumbnailUrl={getThumbnailUrl}
        getLabel={getLabel}
      />
    </section>
  );
};

const WrapVideo = styled.div`
  width: 152px;
  height: 85px;
  margin: 0px 2px 2px 0px;
  border-radius: 4px;
  float: left;
  position: relative;
  cursor: pointer;
`;
const LabelVideo = styled.div`
  position: absolute;
  bottom: 3px;
  font-family: Roboto;
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #ffffff;
  left: 108px;
  background-color: #101426;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16px!important;
  width: 40px;
  padding: 0 4px;
`;

export default VideoGrid;
