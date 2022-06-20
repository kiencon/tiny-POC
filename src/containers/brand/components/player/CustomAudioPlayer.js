import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { makeStyles, Popover } from '@material-ui/core';
import ReactPlayer from 'react-player';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import VolumeMaxIcon from '@material-ui/icons/VolumeUp';
import VolumeMinIcon from '@material-ui/icons/VolumeDown';
import MuteIcon from '@material-ui/icons/VolumeOff';
import Duration from './Duration';

const useStyles = makeStyles(() => ({
  icon: {
    fontSize: '24px',
    cursor: 'pointer',
  },
  deleteIcon: {
    fontSize: '24px',
    cursor: 'pointer',
    marginLeft: '16px',
  },
  duration: {
    fontFamily: 'Roboto',
    fontSize: '12px',
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.33,
    letterSpacing: 'normal',
    color: '#222b45',
  },
  popover: {
    '& .MuiPopover-paper': {
      boxShadow: 'none!important',
      borderRadius: '4px',
      border: 'solid 1px #c5cee0',
      overflow: 'hidden',
      transform: 'rotate(270deg)!important',
      display: 'flex',
      alignItems: 'center',
      padding: '8px 3px',
    },
  },
}));

const CustomAudioPlayer = ({ audio, index, length }) => {
  const classes = useStyles();
  const audioRef = useRef(undefined);
  const [playing, setPlaying] = useState(false);
  const [durations, setDurations] = useState(new Array(length).fill(0));
  const [playeds, setPlayeds] = useState(new Array(length).fill(0));
  const [volumes, setVolumes] = useState(new Array(length).fill(0.5));
  const [volumeValue, setVolumeValue] = useState(0.5);
  const [audioIndex, setAudioIndex] = useState(-1);
  const [volumeIndex, setVolumeIndex] = useState(-1);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const idVolume = open ? 'simple-popover' : undefined;

  const audioCurrent = i => (audioIndex === i);
  const volumeCurrent = i => (volumeIndex === i);

  const handlePlayPause = i => {
    setAudioIndex(i);
    setPlaying(!playing);
  };
  const handleDuration = i => duration => {
    durations.splice(i, 1, duration);
    setDurations(durations);
  };
  const handleProgress = i => state => {
    playeds.splice(i, 1, state.playedSeconds);
    setPlayeds(playedArray => playedArray.splice(0, playedArray.length, ...playeds));
  };
  const handleSeekChange = i => e => {
    playeds.splice(i, 1, e.target.value);
    setPlayeds(playedArray => playedArray.splice(0, playedArray.length, ...playeds));
    if (audioRef.current) {
      audioRef.current.seekTo(playeds[i] / durations[i] || 0);
    }
  };
  const handleAudioPlayer = (r, i) => {
    if (audioCurrent(i)) {
      audioRef.current = r;
    }
  };
  const handleVolumeChange = e => {
    setVolumeValue(parseFloat(e.target.value));
  };
  const handleShowVolume = (e, i) => {
    setVolumeIndex(i);
    setVolumeValue(volumes[i]);
    setAnchorEl(e.currentTarget);
  };
  const handleCloseVolume = i => {
    volumes.splice(i, 1, volumeValue);
    setVolumes(volumeArray => volumeArray.splice(0, volumeArray.length, ...volumes));
    setVolumeIndex(-1);
    setAnchorEl(null);
  };

  const getVolumeIcon = (v, i) => {
    if (v > 0 && v < 0.5) {
      return (
        <VolumeMinIcon className={classes.icon} onClick={e => handleShowVolume(e, i)} aria-describedby={idVolume} />
      );
    }
    if (v === 0) {
      return <MuteIcon className={classes.icon} onClick={e => handleShowVolume(e, i)} aria-describedby={idVolume} />;
    }
    return <VolumeMaxIcon className={classes.icon} onClick={e => handleShowVolume(e, i)} aria-describedby={idVolume} />;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => handlePlayPause(index)}
      >
        {(audioCurrent(index) && playing)
          ? <PauseIcon className={classes.icon} />
          : <PlayIcon className={classes.icon} />}
      </button>
      <ReactPlayer
        ref={r => handleAudioPlayer(r, index)}
        url={audio.url}
        width="0"
        height="0"
        playing={audioCurrent(index) && playing}
        volume={volumeCurrent(index) ? volumeValue : volumes[index]}
        onDuration={handleDuration(index)}
        onProgress={handleProgress(index)}
      />
      <WrapDuration>
        <Duration seconds={playeds[index]} className={classes.duration} />
        &nbsp;/
        <Duration seconds={durations[index]} className={classes.duration} />
      </WrapDuration>
      <Seek
        type="range"
        min={0}
        max={durations[index]}
        value={playeds[index] || 0}
        onChange={handleSeekChange(index)}
      />
      {getVolumeIcon(volumes[index], index)}
      {volumeCurrent(index) && (
        <WrapVolume>
          <Popover
            id={idVolume}
            className={classes.popover}
            open={open}
            anchorEl={anchorEl}
            onClose={() => handleCloseVolume(index)}
          >
            <Volume
              type="range"
              min={0}
              max={1}
              step="any"
              value={volumeValue}
              onChange={handleVolumeChange}
            />
          </Popover>
        </WrapVolume>
      )}
      <DeleteIcon className={classes.deleteIcon} />
    </>
  );
};

const WrapDuration = styled.div`
  margin: 0 16px;
`;
const Seek = styled.input`
  width: 205px;
  height: 3px;
  margin-right: 16px;
  -webkit-appearance: none;
  background: #2e89de;
  cursor: pointer;
  &[type='range']::-webkit-slider-thumb {
    height: 10px;
    width: 10px;
    background: #2e89de;
    cursor: pointer;
    -webkit-appearance: none;
    border-radius: 24px;
  }
`;
const WrapVolume = styled.div`
  background-color: #ffffff;
  border: 1px solid #c5cee0;
`;
const Volume = styled.input`
  width: 80px;
  height: 3px;
  -webkit-appearance: none;
  background: #2e89de;
  cursor: pointer;
  &[type='range']::-webkit-slider-thumb {
    height: 10px;
    width: 10px;
    background: #2e89de;
    cursor: pointer;
    -webkit-appearance: none;
    border-radius: 24px;
  }
`;

export default CustomAudioPlayer;
