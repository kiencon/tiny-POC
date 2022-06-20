// New UI 2022

import { useState } from 'react';

const useDebounce = delaySec => {
  const [inputUtilStop, setInputUtilStop] = useState({
    inputTimeout: 0,
  });

  const onClick = cb => {
    if (inputUtilStop.inputTimeout) {
      clearTimeout(inputUtilStop.inputTimeout);
    }
    setInputUtilStop({
      inputTimeout: setTimeout(() => {
        cb();
        clearTimeout(inputUtilStop.inputTimeout);
      }, delaySec * 1000),
    });
  };

  return onClick;
};

export default useDebounce;
