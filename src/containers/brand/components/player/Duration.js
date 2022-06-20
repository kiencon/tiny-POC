import React from 'react';

const pad = string => (`0 ${string}`).slice(-2);

const format = seconds => {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = pad(date.getUTCMinutes());
  const ss = date.getUTCSeconds();
  if (hh) {
    return ss.toString().length === 2 ? `${hh}:${mm}:${ss}` : `${hh}:${mm}:0${ss}`;
  }
  return ss.toString().length === 2 ? `${mm}:${ss}` : `${mm}:0${ss}`;
};

const Duration = ({ className, seconds }) => (
  <time dateTime={`P${Math.round(seconds)}S`} className={className}>
    {format(seconds)}
  </time>
);

export default Duration;
