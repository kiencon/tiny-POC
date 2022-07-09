import React from 'react';
import DemoMoveable from './components/custom-moveable';
import DemoMoveable1 from './components/custom-moveable/main';

const App = () => {
  console.log('RENDER APP');

  return (
    <>
      {/* <DemoMoveable /> */}
      <DemoMoveable1 />
    </>
  );
};

export default App;
