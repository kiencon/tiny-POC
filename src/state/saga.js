import { takeLeading, put } from 'redux-saga/effects';
import {
  OVERLFOW, handleOverflowSuccess, handleOverflowError, ATTEMPT_MOVE_CONTENT_UP,
  handleAttemptMoveContentUpError,
  handleDeleteEditor,
  handleMoveContentUpSuccess,
} from './action';

const NOT_FOUND = -1;
const TINYMCE_BR = '<br>';
const TINYMCE_BR_WITH_CLASS = '<br data-mce-bogus="1">';
const BR = '&nbsp;';
const EMPTY_STRING = '';
const END_LINE = '\n';
const EMPTY_LINE = '<p>&nbsp;</p>';

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

const replaceFirst = (str, replacedValue) => {
  str = str.replaceAll(END_LINE, '').replaceAll(TINYMCE_BR, BR);
  replacedValue = replacedValue.replaceAll(TINYMCE_BR, BR).replaceAll(TINYMCE_BR_WITH_CLASS, BR);
  let isEffected = false;
  if (str.startsWith(replacedValue)) {
    isEffected = true;
    return [str.replace(replacedValue, EMPTY_STRING), isEffected];
  }
  return [str, isEffected];
};

const replaceLast = (str, replacedValue) => {
  str = str.replaceAll(END_LINE, '').replaceAll(TINYMCE_BR, BR);
  replacedValue = replacedValue.replaceAll(TINYMCE_BR, BR).replaceAll(TINYMCE_BR_WITH_CLASS, BR);
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
  .map(item => ({ ...item, content: item.content.replaceAll(END_LINE, '') }));

const setCaret = (el) => {
  const range = document.createRange()
  const sel = window.getSelection()

  range.setStart(el.lastChild, 1)
  range.collapse(true)

  sel.removeAllRanges()
  sel.addRange(range)
};

const setCursor = (id, refs) => {
  if (id && refs[id]) {
    setCaret(refs[id].targetElm);
  }
}

const getOverflowHtmls = (editorRef) => {
  const overflowHtmls = [];
  const wrapBottom = editorRef.targetElm.parentNode.getBoundingClientRect().bottom;
  const childNodes = editorRef.targetElm.childNodes;

  for (let i = childNodes.length - 1; i >= 0; i -= 1) {
    const item = childNodes[i].outerHTML;
    const bottom = childNodes[i].getBoundingClientRect().bottom;
    if (wrapBottom < bottom) {
      overflowHtmls.push(item);
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
          copiedata[i + 1].content = overflow.replaceAll(TINYMCE_BR_WITH_CLASS, BR).concat(copiedata[i + 1].content);
          // set content
          refs[copiedata[i + 1].id].setContent(copiedata[i + 1].content);
        }
      }
    }
    yield put(handleOverflowSuccess(copiedata, refs, currentPageId));
  } catch (error) {
    yield console.error('------------------------ERROR ON handleOverflowEvent------------------------');
    yield console.log(error);
    yield put(handleOverflowError(payload.state));
  }
}

function* handleAttemptMoveContentUp({ payload }) {
  try {
    const {
      state,
      currentPageId,
    } = payload;
    const refs = getRefs(state);
    const copiedata = deepCopyDataAndRemoveEndline(state);
    const { prevIndex, currentIndex } = getIndexDetail(currentPageId, copiedata);
    const { id } = copiedata[currentIndex];
    const { id: prevId } = copiedata[prevIndex];
    const currentContent = refs[id].getContent();
    // todo
    // we have just check empty line with <p> tag
    // enhance with other tags such as <h1>, <h2>...
    let focusPageId;
    if (prevIndex !== NOT_FOUND) {
      focusPageId = copiedata[prevIndex].id;
    }
    const cloneRefs = { ...refs };
    // remove the last empty page when user enter BACKSPACE
    if (currentContent === EMPTY_STRING && copiedata.length > 1) {
      copiedata.pop();
      cloneRefs[id].destroy();
      delete cloneRefs[id];
      yield setCursor(focusPageId, refs);
      yield put(handleDeleteEditor(copiedata, cloneRefs));
    } else {
      // if the current page is not empty, we must determine something
      // should the item move up to the previous page?
      // otherwise nothing happen
      const splitCurrentContent = currentContent.split(END_LINE);
      const firstItem = splitCurrentContent.shift();
      const newCurrentContent = splitCurrentContent.join(EMPTY_STRING);
      copiedata[currentIndex].content = newCurrentContent;
      cloneRefs[id].setContent(newCurrentContent);
      let { content: prevContent } = copiedata[prevIndex];
      const newPreContent = prevContent.concat(firstItem);
      cloneRefs[prevId].setContent(newPreContent);
      copiedata[prevIndex].content = cloneRefs[prevId].getContent();
      yield put(handleMoveContentUpSuccess(copiedata));
    }
  } catch (error) {
    yield console.error('------------------------ERROR ON handleAttemptMoveContentUp-----------------');
    yield console.log(error);
    yield put(handleAttemptMoveContentUpError(payload.state));
  }
};

export default function* handleOverflowEventSaga() {
  yield takeLeading(OVERLFOW, handleOverflowEvent);
  yield takeLeading(ATTEMPT_MOVE_CONTENT_UP, handleAttemptMoveContentUp);
}
