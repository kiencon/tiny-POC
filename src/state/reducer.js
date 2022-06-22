import immutable from 'immutable';
import { INIT_EDITOR_REF, OVERLFOW } from './action';

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
    content: "<h1>Page 3</h1><p>Hello I love you so much</p><p>No, no no</p><p>I'm ok</p><p>Hello I love you so much</p><p>No, no no</p><p>I'm ok</p>"
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
  if (str.endsWith(replacedValue)) {
    const findIndex = str.lastIndexOf(replacedValue);
    if (findIndex === NOT_FOUND) {
      return str;
    }
    return str.substring(0, findIndex);
  }
  return str;
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

const consistentDom = (data, refs) => {
  return data.map(({ id }) => ({
    id,
    content: refs[id].getContent(),
  })).map(({ id, content }) => ({
    id,
    content: replaceLast(content, EMPTY_LINE)
  }))
};

// we cannot create a new tinymceRef, just insert new content in data
// we will update tinymceRef by id in INIT_EDITOR_REF event when APP re-render
const createNewPageWithContent = (data, newHtmlContent) => {
  // update data
  // create a new page will push new item in data
  const newId = Date.now();
  data.push({ id: newId, content: newHtmlContent, });
};

const removeHtmlContentOverflow = (data, refs, currentIndex, htmlContentOverflow) => {
  // update in data
  const { id, content } = data[currentIndex];
  console.log('-----before replaceLast----');
  console.log('content', content);
  console.log('htmlContentOverflow', htmlContentOverflow);
  const newContent = replaceLast(content, htmlContentOverflow);
  console.log('newcontent', newContent);
  data[currentIndex].content = newContent;
  // update refs
  refs[id].setContent(newContent);
};

const handleCreateNewPage = (data, refs, currentIndex, htmlContentOverflow) => {
  removeHtmlContentOverflow(data, refs, currentIndex, htmlContentOverflow);
  createNewPageWithContent(data, htmlContentOverflow);
  
  return [data, refs];
};

const moveContentDown = (data, refs, indexDetail, htmlContentOverflow) => {
  const { currentIndex, nextIndex } = indexDetail;
  console.log('nextIndex', nextIndex);

  // update data for current page
  const updatedCurrentContent = replaceLast(data[currentIndex].content, htmlContentOverflow);
  data[currentIndex].content = updatedCurrentContent;
  // update data for next page
  const updatedNextContent = htmlContentOverflow.concat(data[nextIndex].content);
  data[nextIndex].content = updatedNextContent;
  // update refs
  console.log('currentIndex', currentIndex);
  const { id: currentId } = data[currentIndex];
  const { id: nextId } = data[nextIndex];
  const currentTinymceRef = refs[currentId];
  console.log('currentId', currentId);
  console.log('currentTinymceRef', currentTinymceRef);
  currentTinymceRef.setContent(updatedCurrentContent);
  const nextTinymceRef = refs[nextId];
  nextTinymceRef.setContent(updatedNextContent);

  return [data, refs];
};

const blocksReducer = (state = init(), action) => {
  switch (action.type) {
    case INIT_EDITOR_REF: {
      const { id, refObj } = action.payload;
      const cloneRefs = getRefs(state);
      cloneRefs[id] = refObj;
      setCaret(refObj.targetElm);
      return state
        .update('data', data => ({
          ...data,
          refs: cloneRefs,
        }));
    }

    // case ON_BEFORE_EDITOR_CHANGE: {
    //   const { id: _id, htmlContent } = action.payload;
    //   const cloneRefs = state.get('data').refs;
    //   const cloneData = [...state.get('data').data.map(({ id }) => (
    //     { id, content: cloneRefs[id].getContent().replace(EMPTY_LINE, EMPTY_STRING) }))
    //   ];
    //   console.log('htmlContent', htmlContent);
    //   cloneData[cloneData.length - 1].content = cloneData[cloneData.length - 1].content.replace(htmlContent, EMPTY_STRING);
    //   console.log('cloneData[cloneData.length - 1].content', cloneData[cloneData.length - 1].content);
    //   cloneRefs[_id].setContent(cloneData[cloneData.length - 1].content);
    //   return state
    //     .update('data', data => ({
    //       ...data,
    //       data: cloneData.concat([{ id: Date.now(), content: htmlContent }])
    //     }));
    // }
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
    case OVERLFOW: {
      const {
        id,
        htmlContent,
      } = action.payload;
      let deepCopiedData = deepCopyData(state);
      const refs = getRefs(state);
      deepCopiedData = consistentDom(deepCopiedData, refs);
      const indexDetail = getIndexDetail(id, deepCopiedData);
      const { nextIndex, currentIndex } = indexDetail;

      const { id: __id__ } = deepCopiedData[currentIndex];
      console.log('refs[__id__].clientHeight', refs[__id__].clientHeight);
      

      let __data__, __refs__;

      // if the current page is the last, nextIndex will be NOT_FOUND
      if (nextIndex === NOT_FOUND) {
        [__data__, __refs__] = handleCreateNewPage(deepCopiedData, refs, currentIndex, htmlContent);
      } else {
        // otherwise, it will be more complicated, so sad
        // please read the code carefully if any bugs
        [__data__, __refs__] = moveContentDown(deepCopiedData, refs, indexDetail, htmlContent);
      }

      return state
          .update('data', () => ({
            data: __data__,
            refs: __refs__,
          }));
    }

    default:
      return state;
  }
};

export default blocksReducer;
