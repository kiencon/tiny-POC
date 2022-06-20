import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Editor from './components/doc-editor/tinymce';
import * as selector from './state/selector';

const initialState = [{
  id: 1,
  content: `<h1>Page 1</h1><p>Hello I love you so much</p><p>No, no no</p><p>I'm ok</p>`
}, {
  id: 2,
  content: `<h1>Page 2</h1><p>Hello I love you so much</p><p>No, no no</p><p>I'm ok</p>`
}, {
  id: 3,
  content: `<h1>Page 3</h1><p>Hello I love you so much</p><p>No, no no</p><p>I'm ok</p>`
}];

const App = () => {
  console.log('RENDER APP');
  const {
    blocks,
  } = useSelector(state => ({
    blocks: selector.selectBlocks(state),
  }));

  console.log(blocks);

  const onChangeContent = (id, newContent) => {
    const cloneState = blocks.data.map(block => {
      if (id !== block.id) {
        return { ...block };
      }
      return {
        ...block,
        content: newContent,
      };
    }).filter(b => b.content !== '');
    // setBlocks(cloneState);
  };

  const createNewPage = () => {
    // setBlocks(cloneState);
  };

  return (
    <>
      {
        blocks.data.map(({ id, content }) => {
          return (<Editor key={id}
            id={id} value={content}
            onChangeContent={onChangeContent}
            createNewPage={createNewPage}
          />)
        })
      }
      <button onClick={() => {
        console.log('print');
      }}>Print</button>
    </>
  );
};

export default App;
