import React from 'react';
import { useSelector } from 'react-redux';
import Editor from './components/doc-editor/tinymce';
import * as selector from './state/selector';

const App = () => {
  console.log('RENDER APP');
  const {
    blocks,
  } = useSelector(state => ({
    blocks: selector.selectBlocks(state),
  }));

  return (
    <>
      {
        blocks.data.map(({ id, content }) => {
          return (<Editor key={id}
            id={id} value={content}
            trickRender={() => { }}
          // onChangeContent={onChangeContent}
          // createNewPage={createNewPage}
          />)
        })
      }
    </>
  );
};

export default App;
