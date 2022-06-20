import React, { useState } from 'react';

const useDropdown = (defaultState, options, styles) => {
  const [state, updateState] = useState(defaultState);
  const Dropdown = () => (
    <div {...styles}>
      <select
        value={state}
        onChange={e => updateState(e.target.value)}
        onBlur={e => updateState(e.target.value)}
      >
        {
        options.map(opt => <option key={opt} value={opt}>{opt}</option>)
      }
      </select>
    </div>
  );
  return [state, Dropdown];
};

export default useDropdown;
