import { useEffect, useState } from 'react';

const breakpoints = {
  1920: 'xl', 1280: 'lg', 1024: 'xmd', 961: 'md', 600: 'sm', 0: 'xs',
};

const useWindowSize = () => {
  const isSSR = typeof window !== 'undefined';
  const [windowSize, setWindowSize] = useState({
    width: isSSR ? 1200 : window.innerWidth,
    height: isSSR ? 800 : window.innerHeight,
  });

  const changeWindowSize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    changeWindowSize();

    window.addEventListener('resize', changeWindowSize);

    return () => {
      window.removeEventListener('resize', changeWindowSize);
    };
  }, []);

  const getBreakpoint = width => {
    const breakpoint = 'xl';
    // eslint-disable-next-line no-restricted-syntax
    for (const key in breakpoints) {
      if (width > +key) {
        return breakpoints[key];
      }
    }
    return breakpoint;
  };

  return [getBreakpoint(windowSize.width), windowSize];
};

export default useWindowSize;
