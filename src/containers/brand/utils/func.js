import WaveSurfer from 'wavesurfer.js';
import html2canvas from 'html2canvas';
import { FILE_TYPES } from '../../../config/constant';

export const blobToImageFile = (blob, fileData, format, index) => {
  const newBlob = new Blob([blob], { type: blob.type });
  const URL = window.URL || window.webkitURL;
  const img = new Image();
  const objectUrl = URL.createObjectURL(blob);
  img.onload = function getDimension() {
    const { width, height } = img;
    newBlob.width = width;
    newBlob.height = height;
  };
  img.src = objectUrl;

  newBlob.lastModifiedDate = new Date();
  newBlob.lastModified = fileData.lastModified;
  newBlob.name = `${fileData.name.split('.')[0]}${typeof index === 'number' ? `-${index}` : ''}.${format}`;
  newBlob.typeFileUpload = FILE_TYPES.image;
  newBlob.webkitRelativePath = fileData.webkitRelativePath;
  newBlob.typeThumbnail = `${fileData.type.split('/')[0]}`;

  return newBlob;
};

export const generateThumbnailFromVideoFile = (file, seekTo, index) => {
  const QUALITY = 1;
  const initSeekTo = 1;

  const drawThumbnail = time => new Promise((resolve, reject) => {
    const videoPlayer = document.createElement('video');
    videoPlayer.setAttribute('src', URL.createObjectURL(file));
    videoPlayer.load();
    videoPlayer.addEventListener('error', err => {
      reject(err);
      return 'Error when loading video file.';
    });
    videoPlayer.addEventListener('loadedmetadata', async () => {
      const { duration } = videoPlayer;
      if (duration < initSeekTo) {
        reject();
        return;
      }
      setTimeout(() => {
        videoPlayer.currentTime = time;
      }, 200);
      videoPlayer.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        ctx.canvas.toBlob(
          blob => {
            resolve({
              thumbnail: blobToImageFile(blob, file, 'jpeg', index),
              duration,
            });
          },
          'image/jpeg',
          QUALITY,
        );
      });
    });
  });

  return drawThumbnail(seekTo);
};
export const generateSnapshotVideoImage = snapshots => {
  const URL = window.URL || window.webkitURL;
  const snapshotsDiv = document.createElement('div');
  snapshotsDiv.setAttribute('id', 'snapshot');
  snapshotsDiv.style.height = 'fit-content';
  snapshotsDiv.style.overflowX = 'scroll';
  snapshotsDiv.style.overflow = 'hidden';
  snapshotsDiv.style.display = 'flex';
  snapshotsDiv.style.position = 'fixed';

  document.getElementById('root').appendChild(snapshotsDiv);

  // eslint-disable-next-line no-restricted-syntax
  for (const blob of snapshots) {
    let blobWebp = blob;
    const img = new Image();
    img.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      ctx.canvas.toBlob(
        cblob => {
          blobWebp = cblob;
        },
        'image/webp',
        1,
      );
    });
    img.src = URL.createObjectURL(blobWebp);
    document.getElementById('snapshot').appendChild(img);
  }

  return new Promise(resolve => {
    resolve(html2canvas(document.getElementById('snapshot'), {
      allowTaint: true,
      useCORS: true,
    }));
  });
};
export const generateThumbnailFromImageFile = file => {
  const QUALITY = 0.75;
  return new Promise(resolve => {
    const rawImage = new Image();
    rawImage.src = URL.createObjectURL(file);

    rawImage.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = rawImage.width;
      canvas.height = rawImage.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(rawImage, 0, 0, canvas.width, canvas.height);
      ctx.canvas.toBlob(
        blob => {
          resolve(blob);
        },
        'image/webp',
        QUALITY,
      );
    });
  });
};
export const generateWaveThumbnailFromAudio = file => {
  const waveDiv = document.createElement('div');
  waveDiv.setAttribute('id', 'waveform');
  waveDiv.style.marginTop = '1000px';

  document.getElementById('root').appendChild(waveDiv);

  const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#2c83eb',
    progressColor: '#2c83eb',
    interact: false,
    hideScrollbar: true,
    cursorColor: 'transparent',
    backgroundColor: 'transparent',
    height: 100,
  });
  wavesurfer.loadBlob(file);
};

export const gcd = (a, b) => {
  if (!b) {
    return a;
  }
  return gcd(b, a % b);
};

export const secondsToMinutes = sec => {
  let second = sec;
  const minutes = Math.floor(second / 60);
  const seconds = second - minutes * 60;
  const hours = Math.floor(second / 3600);
  second -= hours * 3600;

  const strPadLeft = (string, pad, length) => (new Array(length + 1).join(pad) + string).slice(-length);
  return `${strPadLeft(parseInt(minutes, 10), '0', 2)}:${strPadLeft(parseInt(seconds, 10), '0', 2)}`;
};

export const isSafariBrowser = () => {
  // Safari 3.0+ "[object HTMLElementConstructor]"
  const isSafari = /constructor/i.test(window.HTMLElement)
    || (p => p.toString() === '[object SafariRemoteNotification]')(
      !window.safari || (typeof safari !== 'undefined' && window.safari.pushNotification),
    );

  return isSafari;
};

export const getLabel = label => {
  const LIMIT = 41;
  if (label.length > LIMIT) {
    return label.slice(0, 38).padEnd(41, '.');
  }
  return label;
};

export const fileAcceptToString = files => `.${files.join(', .')}`;
