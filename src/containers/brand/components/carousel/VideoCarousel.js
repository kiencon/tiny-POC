import React, { Fragment, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import './videoCarousel.css';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core';
import styled from 'styled-components';

const loadVideoCarouselCss = () => import('./videoCarousel.css');

const useStyles = makeStyles(theme => ({
  modal: {
    backgroundColor: '#101426b3',
    padding: '24px 40px',
    [theme.breakpoints.between('xs', 'sm')]: {
      padding: '24px 16px',
    },
    '& div:first-child': {
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '710px',
      backgroundColor: 'transparent!important',
      marginBottom: '-20px',
      [theme.breakpoints.between('xs', 'sm')]: {
        marginBottom: '124px',
        height: '257px',
      },
      [theme.breakpoints.between('lg', 'xl')]: {
        maxHeight: '620px',
      },
    },
  },
  closeIcon: {
    color: '#ffffff',
    width: '24px',
  },
  reverseArrowIcon: {
    transform: 'rotate(180deg)',
  },
  arrowIcon: {
    color: '#222b45',
    fontSize: '12px',
  },
}));

const VideoCarousel = ({
  videos,
  currentVideo,
  setCurrentVideo,
  isShowCarouselModal,
  setShowCarouselModal,
  getThumbnailUrl,
  getLabel,
}) => {
  const classes = useStyles();

  const handleOnChange = itemIndex => {
    setCurrentVideo(parseInt(itemIndex, 10));
  };

  useEffect(() => {
    loadVideoCarouselCss();
  }, []);

  return (
    <>
      <Modal
        className={`${classes.modal} video-carousel`}
        open={isShowCarouselModal}
        onClose={() => setShowCarouselModal(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Carousel
          selectedItem={currentVideo}
          showStatus={false}
          showIndicators={false}
          useKeyboardArrows
          thumbWidth={123}
          autoPlay={false}
          onChange={handleOnChange}
        >
          {videos.map((video, index) => (
            <Fragment key={video.label}>
              {currentVideo === index && (
                <Wrap>
                  <WrapVideo
                    autoPlay
                    infiniteLoop
                    width="946px"
                    height="532px"
                    poster={video.metadata.url}
                    controls
                  >
                    <source src={video.url} type="video/mp4" />
                    <track kind="captions" />
                  </WrapVideo>
                </Wrap>
              )}
              <img
                src={getThumbnailUrl(video)}
                alt={getLabel(video)}
                width={115}
                height={65}
              />
            </Fragment>
          ))}
        </Carousel>
      </Modal>
      {isShowCarouselModal && (
        <WrapClose onClick={() => setShowCarouselModal(false)}>
          <CloseIcon className={classes.closeIcon} />
        </WrapClose>
      )}
    </>
  );
};

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 767px) {
    video[poster] {
      height: 257px;
      width: 100%;
    }
  }
  @media only screen and (min-width: 768px) and (max-width: 960px) {
    video[poster] {
      height: fit-content;
      width: 100%;
    }
  }
`;
const WrapVideo = styled.video`
  ::-webkit-media-controls-panel {
    display: flex !important;
    opacity: 1 !important;
  }
  @media only screen and (max-width: 960px) {
    display: flex;
    align-items: center;
    video {
      width: 100%;
      height: fit-content;
    }
  }
`;
const WrapClose = styled.div`
  position: fixed;
  top: 32px;
  right: 36px;
  z-index: 1301;
  cursor: pointer;
`;

export default VideoCarousel;
