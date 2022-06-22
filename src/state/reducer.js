import immutable from 'immutable';
import { ON_BEFORE_EDITOR_CHANGE } from './action';

const NOT_FOUND = -1;
const EMPTY_LINE = '<p>&nbsp;</p>';
const EMPTY_STRING = '';

export const initialState = {
  data: [{
    id: 'azbc',
    content: "<h1>Page 1</h1><p>Hello I love you so much</p><p>No, no no</p><p>I'm ok</p>"
  }, {
    id: 'ad2s',
    content: "<h1>Page 2</h1><p>Hello I love you so much</p><p>No, no no</p><p>I'm ok</p>"
  }, {
    id: 'asd3',
    content: "<h1>Page 3</h1><p>Hello I love you so much</p><p>No, no no</p><p>I'm ok</p>"
  }],
  refs: {},
};

const getIndexDetail = (id, arrayObj) => {
  let prevIndex, currentIndex, nextIndex;
  currentIndex = arrayObj.findIndex(e => e.id === id);
  if (currentIndex === NOT_FOUND) {
    return { prevIndex: NOT_FOUND, currentIndex: NOT_FOUND, nextIndex: NOT_FOUND };
  }
  nextIndex = currentIndex + 1;
  prevIndex = currentIndex - 1;
  if (nextIndex >= arrayObj.length) {
    nextIndex = NOT_FOUND;
  }
  if (prevIndex < 0) {
    prevIndex = NOT_FOUND;
  }
  return { prevIndex, currentIndex, nextIndex };
};

const replaceFirst = (str, replacedValue) => str.replace(replacedValue, EMPTY_STRING);

const replaceLast = (str, replacedValue) => {
  const findIndex = str.lastIndexOf(replacedValue);
  if (findIndex === NOT_FOUND) {
    return str;
  }
  return str.substring(0, findIndex);
};

const getRefs = stateRef => stateRef.get('data').refs;

const deepCopyData = stateRef => stateRef.get('data').data.map(item => ({ ...item }));

const setCaret = (el) => {
  const range = document.createRange()
  const sel = window.getSelection()

  range.setStart(el.lastChild, 1)
  range.collapse(true)

  sel.removeAllRanges()
  sel.addRange(range)
};

const init = () => {
  const initValue = immutable.fromJS({
    data: undefined,
    isLoading: undefined,
    effect: 0,
  });

  return initValue
    .set('data', {
      ...initialState,
    })
    .set('isLoading', false)
    .set('effect', 0);
};

const createNewPageWithContent = (data, refs, newHtmlContent, refObj) => {
  // update data
  // create a new page will push new item in data
  const newId = Date.now();
  data.push({ id: newId, content: newHtmlContent, });
  // update refs
  // we need to generate a new id, using uuid or Date.now()?
  refs[newId] = refObj;
  refObj.setContent(newHtmlContent);
};

const removeHtmlContentOverflow = (data, refs, currentIndex, htmlContentOverflow) => {
  // update in data
  const { id, content } = data[currentIndex];
  const newContent = replaceLast(content, htmlContentOverflow);
  data[currentIndex].content = newContent;
  // update refs
  refs[id].setContent(newContent);
};

const handleCreateNewPage = (data, refs, currentIndex, htmlContentOverflow, refObj) => {
  removeHtmlContentOverflow(data, refs, currentIndex, htmlContentOverflow);
  createNewPageWithContent(data, refs, htmlContentOverflow, refObj);

  return [data, refs];
};

const moveContentDown = (data, refs, htmlContentOverflow) => {};

const blocksReducer = (state = init(), action) => {
  switch (action.type) {
    // case INSERT_NEW_TINYMCE: {
    //   const { id, refObj } = action.payload;
    //   const cloneRefs = getRefs(state);
    //   cloneRefs[id] = refObj;
    //   setCaret(refObj.targetElm);
    //   return state
    //     .update('data', data => ({
    //       ...data,
    //       refs: cloneRefs,
    //     }));
    // }

    case ON_BEFORE_EDITOR_CHANGE: {
      const { id: _id, htmlContent } = action.payload;
      const cloneRefs = state.get('data').refs;
      const cloneData = [...state.get('data').data.map(({ id }) => (
        { id, content: cloneRefs[id].getContent().replace(EMPTY_LINE, EMPTY_STRING) }))
      ];
      console.log('htmlContent', htmlContent);
      cloneData[cloneData.length - 1].content = cloneData[cloneData.length - 1].content.replace(htmlContent, EMPTY_STRING);
      console.log('cloneData[cloneData.length - 1].content', cloneData[cloneData.length - 1].content);
      cloneRefs[_id].setContent(cloneData[cloneData.length - 1].content);
      return state
        .update('data', data => ({
          ...data,
          data: cloneData.concat([{ id: Date.now(), content: htmlContent }])
        }));
    }
    /*
    

    case DELETE_BLOCK_EDITOR: {
      const { payload: id } = action;
      const cloneRefs = state.get('data').refs;
      cloneRefs[id].destroy();
      delete cloneRefs[id];
      const cloneData = [...state.get('data').data.filter(e => e.id !== id).map(({ id }) => (
        { id, content: cloneRefs[id].getContent() }))
      ];
      const lastId = cloneData[cloneData.length - 1].id;
      setCaret(cloneRefs[lastId].targetElm);
      cloneRefs[lastId].focus();
      return state
        .update('data', () => ({
          data: cloneData,
          refs: cloneRefs,
        }));
    }

    case CONTENT_UP: {
      console.log('CONTENT_UP REDUCER');
      const data = state.get('data').data;
      const { id, htmlContent } = action.payload;
      const { prevIndex: prev, currentIndex: current } = getIndexDetail(id, state.get('data').data);
      if (prev === NOT_FOUND) {
        return state;
      }
      const { id: prevId, content } = data[prev];
      console.log('cotent', content, typeof content);
      const lastIndexOfEmptyLine = content.lastIndexOf(EMPTY_LINE);
      let updatedContent = content;
      if (lastIndexOfEmptyLine !== -1) {
        updatedContent = content.substring(0, lastIndexOfEmptyLine).concat(htmlContent);
      }
      const cloneData = data.map(e => ({ ...e }));
      console.log('updatedContent', updatedContent);
      cloneData[prev].content = updatedContent;
      const cloneRefs = state.get('data').refs;
      cloneRefs[prevId].setContent(updatedContent);
      return state
        .update('data', data => ({
          ...data,
          data: cloneData,
        }));
    }
    */

    /**
     * incase, on editor change, push some text and make page overflow
     * just only happen when move content down
     * 
     * logic:
     * we are standing in the page which is overlow,
     * check the next is existed?
     * 1. if not, we make a new page and push the content overflow in the new
     * 2. otherwise, push the content overflow at the first position in the next page,
     * check overflow and recursive
     */
    // case OVERLFOW: {
    //   const {
    //     id,
    //     htmlContent,
    //     tinymceRef,
    //   } = action.payload;
    //   const deepCopiedData = deepCopyData(state);
    //   const refs = getRefs(state);
    //   const { nextIndex, currentIndex } = getIndexDetail(id, deepCopiedData);
    //   // if the current page is the last, nextIndex will be NOT_FOUND
    //   if (nextIndex !== NOT_FOUND) {
    //     const [__data__, __refs__] = handleCreateNewPage(deepCopiedData, refs, currentIndex, htmlContent, tinymceRef);
    //     return state
    //       .update('data', () => ({
    //         data: __data__,
    //         refs: __refs__,
    //       }));
    //   }
    //   // otherwise, it will be more complicated, so sad
    //   // please read the code carefully if any bugs
    //   // return moveContentDown(state, stateRef, htmlContent);
    //   return state;
    // }

    default:
      return state;
  }
};

export default blocksReducer;
