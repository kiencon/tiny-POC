import { takeLeading, put } from 'redux-saga/effects';
import {
  OVERLFOW, handleOverflowSuccess, handleOverflowError
} from './action';

const NOT_FOUND = -1;
const TINYMCE_BR = '<br>';
const BR = '&nbsp;';
const EMPTY_STRING = '';

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

const replaceLast = (str, replacedValue) => {
  str = str.replaceAll('\n', '').replaceAll(TINYMCE_BR, BR);
  replacedValue = replacedValue.replaceAll(TINYMCE_BR, BR);
  let isEffected = false;
  if (str.endsWith(replacedValue)) {
    const findIndex = str.lastIndexOf(replacedValue);
    isEffected = true;
    return [str.substring(0, findIndex), isEffected];
  }
  return [str, isEffected];
};

const getRefs = stateRef => stateRef.get('data').refs;

const deepCopyDataAndRemoveEndline = stateRef => stateRef
  .get('data')
  .data
  .map(item => ({ ...item, content: item.content.replaceAll('\n', '') }));

const setCaret = (el) => {
  const range = document.createRange()
  const sel = window.getSelection()

  range.setStart(el.lastChild, 1)
  range.collapse(true)

  sel.removeAllRanges()
  sel.addRange(range)
};

const getOverflowHtmls = (editorRef) => {
  const overflowHtmls = [];
  const wrapBottom = editorRef.targetElm.parentNode.getBoundingClientRect().bottom;
  const childNodes = editorRef.targetElm.childNodes;

  for (let i = childNodes.length - 1; i >= 0; i -= 1) {
    const bottom = childNodes[i].getBoundingClientRect().bottom;
    if (wrapBottom < bottom) {
      overflowHtmls.push(childNodes[i].outerHTML);
    } else {
      break;
    }
  }

  return overflowHtmls.reverse().join(EMPTY_STRING);
};

const setDataFromRefs = (data, refs, currentIndex) => {
  for (let i = currentIndex; i < data.length; i += 1) {
    const { id } = data[i];
    if (refs[id]) {
      data[i].content = refs[id].getContent();
    }
  }
};

function* handleOverflowEvent({ payload }) {
  try {
    const { id: currentPageId, state } = payload;
    const refs = getRefs(state);
    const copiedata = deepCopyDataAndRemoveEndline(state);
    const { currentIndex } = getIndexDetail(currentPageId, copiedata);
    setDataFromRefs(copiedata, refs, currentIndex);

    for (let i = currentIndex; i < copiedata.length; i += 1) {
      const { id, content } = copiedata[i];
      if (refs[id] === undefined) {
        break;
      }
      const overflow = getOverflowHtmls(refs[id]);
      // replace new
      const [newContent, isEffected] = replaceLast(content, overflow);
      if (isEffected) {
        copiedata[i].content = newContent;
        refs[copiedata[i].id].setContent(copiedata[i].content);
      }
      // check create new page if needed
      if (i === copiedata.length - 1 && overflow !== EMPTY_STRING) {
        copiedata.push({ id: Date.now(), content: overflow });
      } else { // otherwise concat overflow content into next page
        if (i < copiedata.length - 1) {
          copiedata[i + 1].content = overflow.concat(copiedata[i + 1].content);
          // set content
          refs[copiedata[i + 1].id].setContent(copiedata[i + 1].content);
        }
      }
    }
    yield put(handleOverflowSuccess(copiedata, refs, currentPageId));
  } catch (error) {
    yield console.error('------------------------ERROR------------------------');
    yield console.log(error);
    yield put(handleOverflowError(payload.state));
  }
}

export default function* handleOverflowEventSaga() {
  yield takeLeading(OVERLFOW, handleOverflowEvent);
}
