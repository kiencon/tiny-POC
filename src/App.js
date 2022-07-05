import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Editor from './components/doc-editor/tinymce';
import * as selector from './state/selector';
import { getBaseTemplateData } from './state/action';

const App = () => {
  console.log('RENDER APP');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBaseTemplateData())
  }, [dispatch]);
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
