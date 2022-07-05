import immutable from 'immutable';
import { INIT_EDITOR_REF, 
  OVERLFOW_ERROR, ON_KEY_UP_EVENT,
  OVERLFOW_SUCCESS, DELETE_BLOCK_EDITOR, MOVE_CONTENT_UP_SUCCESS, GET_BASE_TEMPLATE_DATA_SUCCESS 
} from './action';

export const initialState = {
  data: [{
    id: 'page1',
    content: "<h1>Page 1</h1><h1>Page 1</h1><p>I'm ok</p>"
  }, {
    id: 'page2',
    content: "<h1>Page 2</h1><p>Hello I love you so much</p><p>No, no no</p><p>I'm ok</p>"
  }, {
    id: 'page3',
    content: "<h1>Page 3</h1><p><br></p><p>Hello I love you so much</p><p>No, no no</p><h3>Testing</h3>"
  }],
  refs: {},
};

const getRefs = stateRef => stateRef.get('data').refs;

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

    case OVERLFOW_SUCCESS: {
      const { data, refs } = action.response;
      return state.update('data', () => ({
        data,
        refs,
      }));
    }

    case ON_KEY_UP_EVENT: {
      //todo
      return state;
    }

    case OVERLFOW_ERROR: {
      return action.response;
    }

    case DELETE_BLOCK_EDITOR: {
      return state.update('data', () => ({
        ...action.response,
      }));
    }

    case MOVE_CONTENT_UP_SUCCESS: {
      console.log('MOVE_CONTENT_UP_SUCCESS action.response', action.response)
      return state.update('data', data => ({
        ...data,
        data: action.response,
      }));
    }

    case GET_BASE_TEMPLATE_DATA_SUCCESS: {
      const { data: _data, htmlBlocks } = action.payload;
      return state.update('data', data => ({
        ...data,
        data: htmlBlocks
      }));
    }

    default:
      return state;
  }
};

export default blocksReducer;
