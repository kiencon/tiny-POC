import { useEffect, useRef, useState } from 'react';

const useClickAwayListener = initialIsVisible => {
  const [isShow, setIsShow] = useState(initialIsVisible);
  const ref = useRef(null);

  const handleHideDropdown = event => {
    if (event.key === 'Escape') {
      setIsShow(false);
    }
  };

  const handleClickOutside = event => {
    const stopClickAwayList = ['UL', 'LI', 'SPAN'];
    if (
      stopClickAwayList.includes(event.target.tagName)
      || event.target.id === 'component-content'
      || event.target.dataset.color
    ) {
      return;
    }

    if (ref.current && !ref.current.contains(event.target)) {
      setIsShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleHideDropdown, true);
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('keydown', handleHideDropdown, true);
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return { ref, isShow, setIsShow };
};

export default useClickAwayListener;
