import immutable from 'immutable';
import { DELETE_BLOCK_EDITOR, INIT_EDITOR_REF, ON_BEFORE_EDITOR_CHANGE } from './action';

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
  refs: {}
};

const setCaret = (el) => {
  var range = document.createRange()
  var sel = window.getSelection()

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

const blocksReducer = (state = init(), action) => {
  switch (action.type) {
    case INIT_EDITOR_REF: {
      const { id, refObj } = action.payload;
      const cloneRefs = { ...state.get('data').refs };
      cloneRefs[id] = refObj;
      setCaret(refObj.targetElm);
      return state
        .update('data', data => ({
          ...data,
          refs: cloneRefs,
        }));
    }
    case ON_BEFORE_EDITOR_CHANGE: {
      const { id: _id, htmlContent } = action.payload;
      const cloneRefs = state.get('data').refs;
      const cloneData = [...state.get('data').data.map(({ id }) => (
        { id, content: cloneRefs[id].getContent().replace('<p>&nbsp;</p>', '') }))
      ];
      console.log('htmlContent', htmlContent);
      cloneData[cloneData.length - 1].content = cloneData[cloneData.length - 1].content.replace(htmlContent, '');
      console.log('cloneData[cloneData.length - 1].content', cloneData[cloneData.length - 1].content);
      cloneRefs[_id].setContent(cloneData[cloneData.length - 1].content);
      return state
        .update('data', data => ({
          ...data,
          data: cloneData.concat([{ id: Date.now(), content: htmlContent }])
        }));
    }

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
        .update('data', data => ({
          data: cloneData,
          refs: cloneRefs,
        }));
    }

    default:
      return state;
  }
};

export default blocksReducer;
