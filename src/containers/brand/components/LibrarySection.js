import {
  Button, makeStyles, Tab, Tabs, withStyles,
} from '@material-ui/core';
import UploadIcon from '@material-ui/icons/CloudUploadOutlined';
import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import styled from 'styled-components';
import FileIcon from '../../../commons/assets/svg/no-file.svg';
import CircleProgress from '../../../components/common/CircleProgress';
import {
  AUDIO_ACCEPT,
  FILE_TYPES,
  IMAGE_ACCEPT,
  VIDEO_ACCEPT,
} from '../../../config/constant';
import useWindowSize from '../../../hooks/useWindowSize';
import { signedUrlFile, updateLoading, updateLoaded } from '../state/action';
import {
  blobToImageFile,
  generateThumbnailFromImageFile,
  generateThumbnailFromVideoFile,
  fileAcceptToString,
  generateWaveThumbnailFromAudio,
  generateSnapshotVideoImage,
} from '../utils/func';
import AudioTab from './AudioTab';
import ImageGrid from './ImageGrid';
import VideoGrid from './VideoGrid';
import { toastrFail } from '../../../components/common/toastCustom';

const loadCarouselCss = () => import('./carousel/carousel.css');

const AntTabs = withStyles({
  root: {
    border: 'none',
    marginBottom: '16px',
  },
  indicator: {
    backgroundColor: '#2e3a59',
  },
})(Tabs);

const AntTab = withStyles(() => ({
  root: {
    textTransform: 'none',
    minWidth: '33.33%',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontSize: '15px',
    borderBottom: 'none',
    color: '#8f9bb3',
    '&:hover': {
      color: '#222b45',
      fontWeight: 'bold',
    },
    '&$selected': {
      color: '#222b45',
      fontWeight: 'bold',
    },
  },
  selected: {},
}))(props => <Tab disableRipple {...props} />);

const TabPanel = props => {
  const {
    children, value, index, ...other
  } = props;
  const [, windowSize] = useWindowSize();
  const isMobile = windowSize.width < 960;
  const isTablet = windowSize.width > 767 && windowSize.width < 960;

  const defineDevice = () => {
    if (isTablet || isMobile) {
      return '100%';
    }
    return '461px';
  };

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{
        width: defineDevice(),
        boxSizing: 'border-box',
      }}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: '0',
    marginTop: '8px',
    '& span': {
      height: '3px',
    },
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
  },
  padding: {
    padding: '24px',
  },
  inputUpload: {
    display: 'none',
  },
  buttonUploadFile: {
    boxShadow: 'none',
    width: '100%',
    height: '100%',
    textTransform: 'capitalize',
    fontFamily: 'Roboto',
    fontSize: '12px',
    fontWeight: 'bold',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: '1.33',
    letterSpacing: 'normal',
    color: '#222b45',
    '&:hover': {
      color: '#ffffff',
      backgroundColor: '#222b45',
    },
  },
  buttonUploadFileProgress: {
    boxShadow: 'none',
    width: '100%',
    height: '100%',
    borderRadius: '4px',
    backgroundColor: '#222b45',
    '&:hover': {
      color: '#ffffff',
      backgroundColor: '#222b45',
    },
  },
  uploadIcon: {
    marginRight: '8px',
    fontSize: '16px',
  },
  deleteIcon: {
    position: 'absolute',
    left: '423px',
    fontSize: '24px',
    backgroundColor: '#f7f9fc',
    cursor: 'pointer',
    [theme.breakpoints.between('xs', 'sm')]: {
      left: '-38px',
      position: 'relative',
    },
  },
  fileIcon: {
    float: 'left',
    fontSize: '80px',
    color: '#2e3a59',
    marginRight: '11px',
    backgroundColor: '#ffffff',
  },
  gridList: {
    width: '461px',
    margin: '0!important',
    '& li': {
      height: 'fit-content!important',
      padding: '0 2px 0px 0!important',
    },
  },
}));

const a11yProps = index => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

const NotFileFound = ({ classes, file, fileAccept }) => (
  <WrapEmpty>
    <EmptyContent>
      <img className={classes.fileIcon} src={FileIcon} alt="no-file.svg" />
      <Label>{`No ${file}`}</Label>
      <SubLabel>{`Support: .${fileAccept.join(', .')}`}</SubLabel>
    </EmptyContent>
  </WrapEmpty>
);

const LibrarySection = ({
  dispatch,
  informationImage,
  informationVideo,
  informationAudio,
  isLoading,
  typeFileUploading,
}) => {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);
  const tabs = [
    {
      label: 'Photo',
      acceptFile: 'image/*',
    },
    {
      label: 'Video',
      acceptFile: 'video/*',
    },
    {
      label: 'Audio',
      acceptFile: 'audio/*',
    },
  ];
  const [, windowSize] = useWindowSize();
  const isMobile = windowSize.width < 960;
  const isTablet = windowSize.width > 767 && windowSize.width < 960;
  const defineDevice = () => {
    if (isTablet || isMobile) {
      return '100%';
    }
    return '461px';
  };

  useEffect(() => {
    loadCarouselCss();
  }, []);

  const handleTabChange = (event, index) => {
    setTabIndex(index);
  };
  const handleFileSelect = async e => {
    const fileData = e.target.files[0];
    e.target.value = null;
    const [detectTypeMedia, fileExt] = fileData.type.split('/');
    fileData.typeFileUpload = FILE_TYPES[detectTypeMedia];
    const fileSupport = [...IMAGE_ACCEPT, ...VIDEO_ACCEPT, ...AUDIO_ACCEPT];
    const checkFileAccept = fileSupport.find(
      fileAccept => fileAccept === fileExt,
    );

    if (!checkFileAccept) {
      toastrFail(`Only support .${fileSupport.join(', .')}`);
      e.target.value = null;
      return;
    }
    if (detectTypeMedia === 'image') {
      const URL = window.URL || window.webkitURL;
      const img = new Image();
      const objectUrl = URL.createObjectURL(fileData);
      img.onload = function getDimension() {
        const { width, height } = img;
        fileData.width = width;
        fileData.height = height;
      };
      img.src = objectUrl;
      const blob = await generateThumbnailFromImageFile(fileData);
      const getThumbnail = blobToImageFile(blob, fileData, 'webp');
      fileData.thumbnail = getThumbnail;
      if (
        !informationImage.find(
          image => decodeURIComponent(image.label.split('/')[0])
            === fileData.name.split('.')[0],
        )
      ) {
        dispatch(signedUrlFile(fileData));
      }
      return;
    }
    if (detectTypeMedia === 'video') {
      try {
        const snapshotAtTime = [];
        let durationVideo;
        const timesSeekTo = [];

        await Promise.all([1].map(async (time, i) => {
          const generateThumbnail = await generateThumbnailFromVideoFile(fileData, time, i);
          const { thumbnail, duration } = generateThumbnail;
          durationVideo = duration;
          if (duration <= 10) {
            const snapshotArr = [2, 3];
            const captureForEach = duration > 3 ? parseInt(duration / 3, 10) : duration / 3;
            // eslint-disable-next-line no-restricted-syntax
            for (const snapshotTime of snapshotArr) {
              timesSeekTo.push(captureForEach * snapshotTime);
            }
          } else if (duration > 10) {
            const snapshotArr = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            const captureForEach = duration > 15 ? parseInt(duration / 15, 10) : duration / 15;
            // eslint-disable-next-line no-restricted-syntax
            for (const snapshotTime of snapshotArr) {
              timesSeekTo.push(captureForEach * snapshotTime);
            }
          }
          snapshotAtTime.push(thumbnail);
        }));
        if (timesSeekTo.length > 0) {
          await Promise.all(timesSeekTo.map(async (time, i) => {
            const generateThumbnail = await generateThumbnailFromVideoFile(fileData, time, i + 1);
            const { thumbnail } = generateThumbnail;
            snapshotAtTime.push(thumbnail);
          }));
        }

        // Merge snapshots
        await Promise.all([0].map(async () => {
          const splitNameOrder = name => parseInt((name.split('-').slice(-1))[0].split('.')[0], 10);
          const compareName = (name1, name2) => (splitNameOrder(name1) > splitNameOrder(name2) ? 1 : -1);
          snapshotAtTime.sort((s1, s2) => compareName(s1.name, s2.name));

          dispatch(updateLoading());

          await generateSnapshotVideoImage(snapshotAtTime);
          const el = document.getElementById('snapshot');
          await html2canvas(el, {
            allowTaint: true,
            useCORS: true,
            scrollX: -window.scrollX,
            windowWidth: el.scrollWidth,
          }).then(canvas => {
            const quantity = 0.1;
            el.remove();
            canvas.toBlob(
              blob => {
                snapshotAtTime.push(blobToImageFile(blob, fileData, 'jpeg', 99));
              },
              'image/jpeg',
              quantity,
            );
          });
        }));

        setTimeout(() => {
          fileData.thumbnails = snapshotAtTime;
          fileData.duration = durationVideo;

          if (!informationVideo.find(video => decodeURIComponent(video.label) === fileData.name)) {
            dispatch(updateLoaded());
            dispatch(signedUrlFile(fileData));
          }
        }, 200);
      } catch (ex) {
        console.log('Error: ', ex);
      }
      return;
    }
    if (detectTypeMedia === 'audio') {
      let thumbnailAudio;

      dispatch(updateLoading());
      generateWaveThumbnailFromAudio(fileData);

      const MIN_DELAY = 2000;
      const captureThumbnailTimer = setTimeout(() => {
        const el = document.getElementById('waveform');
        if (el) {
          html2canvas(el, {
            allowTaint: true,
            useCORS: true,
            scrollX: -window.scrollX,
            windowWidth: el.scrollWidth,
          }).then(canvas => {
            const quantity = 0.1;
            canvas.toBlob(
              blob => {
                thumbnailAudio = blobToImageFile(blob, fileData, 'jpeg');
                el.remove();
                const media = new Audio();
                const objectUrl = URL.createObjectURL(fileData);
                media.onloadedmetadata = function getDuration() {
                  const { duration } = media;
                  fileData.duration = duration;
                };
                media.src = objectUrl;

                fileData.thumbnail = thumbnailAudio;
                if (!informationImage.find(audio => decodeURIComponent(audio.label) === fileData.name)) {
                  dispatch(updateLoaded());
                  dispatch(signedUrlFile(fileData));
                }
              },
              'image/jpeg',
              quantity,
            );
          });
        }
        clearTimeout(captureThumbnailTimer);
      }, MIN_DELAY);
    }
  };

  return (
    <>
      <UploadWrapper>
        <label htmlFor="contained-button">
          <input
            accept={fileAcceptToString([
              ...IMAGE_ACCEPT,
              ...VIDEO_ACCEPT,
              ...AUDIO_ACCEPT,
            ])}
            className={classes.inputUpload}
            id="contained-button"
            multiple={false}
            type="file"
            onChange={event => event.target.files.length && handleFileSelect(event)}
          />
          <Button
            component="span"
            className={`${
              isLoading
              && (typeFileUploading === FILE_TYPES.image
                || typeFileUploading === FILE_TYPES.video
                || typeFileUploading === FILE_TYPES.audio)
                ? classes.buttonUploadFileProgress
                : classes.buttonUploadFile
            }`}
          >
            {isLoading
            && (typeFileUploading === FILE_TYPES.image
              || typeFileUploading === FILE_TYPES.video
              || typeFileUploading === FILE_TYPES.audio) ? (
                <CircleProgress />
              ) : (
                <>
                  <UploadIcon className={classes.uploadIcon} />
                  Upload File
                </>
              )}
          </Button>
        </label>
      </UploadWrapper>
      <div className={`${classes.root}`} style={{ width: defineDevice() }}>
        <AntTabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="library"
        >
          {tabs.map(({ label }, index) => (
            <AntTab key={label} label={label} {...a11yProps(index)} />
          ))}
        </AntTabs>
        <TabPanel value={tabIndex} index={0}>
          {informationImage.length ? (
            <ImageGrid
              informationImage={informationImage}
              fallback={(
                <NotFileFound
                  classes={classes}
                  file="photo"
                  fileAccept={IMAGE_ACCEPT}
                />
              )}
            />
          ) : (
            <NotFileFound
              classes={classes}
              file="photo"
              fileAccept={IMAGE_ACCEPT}
            />
          )}
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          {informationVideo.length ? (
            <VideoGrid informationVideo={informationVideo} />
          ) : (
            <NotFileFound
              classes={classes}
              file="video"
              fileAccept={VIDEO_ACCEPT}
            />
          )}
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          {informationAudio.length ? (
            <AudioTab informationAudio={informationAudio} />
          ) : (
            <NotFileFound
              classes={classes}
              file="audio"
              fileAccept={AUDIO_ACCEPT}
            />
          )}
        </TabPanel>
      </div>
    </>
  );
};

const WrapEmpty = styled.div`
  width: 100%;
  height: 176px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 960px) {
    width: 75%;
  }
`;
const EmptyContent = styled.div`
  width: 250px;
`;
const Label = styled.div`
  font-family: Roboto;
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  color: #222b45;
`;
const SubLabel = styled.div`
  font-family: Roboto;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.85;
  letter-spacing: normal;
  color: #8f9bb3;
`;
const UploadWrapper = styled.div`
  border-radius: 4px;
  border: solid 1px #222b45;
  width: 461px;
  height: 32px;
  text-align: center;
  @media only screen and (max-width: 960px) {
    width: 100%;
  }
`;

export default LibrarySection;
