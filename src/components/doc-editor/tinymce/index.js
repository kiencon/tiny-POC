import { Editor } from '@tinymce/tinymce-react';
import React, {
  useRef, useState
} from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { initEditorRef, handleOnBeforeEditorChange, handleDeleteBlockEditor } from '../../../state/action';

const TINY_INLINE_TYPE = 'tiny_inline';
const TINY_TABLE_TYPE = 'tiny_table';
const EVENT_CHECKLIST = { key: '.' };
const ON_CHANGE_CHECK_LIST = 'onChangeCheckList';
const QUICKBAR_BTNS = `bold italic quicklink h2 h3 blockquote numlist bullist checklist formatpainter`;
const TOOLBAR_BTNS = `addfield | tablemergecells tablesplitcells | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | cellchangebackcolor tabledeletecustom`

const CONFIG_BY_TYPE = {
  [TINY_INLINE_TYPE]: {
    toolbar: 'fasle',
    menubar: false,
    plugins: 'lists paste table',
    paste_preprocess: (_, o) => {
      console.log('paste_preprocess', _, o);
    },
  },
  [TINY_TABLE_TYPE]: {
    toolbar: false,
    menubar: false,
    plugins: 'lists table paste quickbars link autolink',
    table_clone_elements: 'p span div ul li',
    table_sizing_mode: 'fixed',
    table_cell_advtab: false,
    contextmenu: 'link checklist',
    paste_preprocess: (_, o) => {
      console.log('paste_preprocess', _, o)
    },
    quickbars_selection_toolbar: QUICKBAR_BTNS,
    mobile: {
      menubar: false,
      plugins: 'lists table paste quickbars link autolink',
      quickbars_selection_toolbar: QUICKBAR_BTNS,
      table_toolbar: TOOLBAR_BTNS,
    },
  },
}

// eslint-disable-next-line
const TINY_API_KEY = process.env.REACT_APP_TINY_API_KEY || 'u5sfb1u25uuw0a28t8gxh1762mrnf2skxekksa4709facfgk'
const TINY_MCE_SRC = 'https://editors-upload.s3.amazonaws.com/lib/tinymce/js/tinymce/tinymce.min.js'

const checkOverflow = (el) => {
  const curOverflow = el.style.overflow;

  if (!curOverflow || curOverflow === "visible")
    el.style.overflow = "hidden";

  const isOverflowing = el.clientWidth < el.scrollWidth
    || el.clientHeight < el.scrollHeight;

  el.style.overflow = curOverflow;

  return isOverflowing;
};

function setCaret(el) {
  var range = document.createRange()
  var sel = window.getSelection()

  range.setStart(el.lastChild, 1)
  range.collapse(true)

  sel.removeAllRanges()
  sel.addRange(range)
}

const setCursor = (ed, element, start) => {
  setCaret(ed.targetElm);
};

const TinymceCustom = React.memo((props) => {
  const {
    value,
    id,
    createNewPage,
  } = props;
  const {
    tinyType = TINY_INLINE_TYPE,
    tinyUUID,
    blockOrder,
    item,
    block,
  } = props
  const initProp = {
    auto_focus: true,
  }
  const { order } = item || {}
  const InitEdior = CONFIG_BY_TYPE[tinyType]
  const editorRef = useRef(null);
  const wrapEditorRef = useRef(null);
  console.log(`RENDER TinymceCustom ${editorRef.current?.id}`);
  const [innerValue, setInnerValue] = useState(value);
  const [classes, setClasses] = useState(['tinymce-custom']);

  const dispatch = useDispatch();

  // const { proposalTokensMap } = useSelector(
  //   ({ present }) => ({
  //     proposalTokensMap: present.proposal.tokensMap,
  //   }),
  //   shallowEqual,
  // )

  const handleOnBlur = event => {
    if (props.onBlur) props.onBlur(editorRef)
    let isOutFocus = true
    setTimeout(() => {
      if (isOutFocus && props.onOutFocus) {
        props.onOutFocus(event)
      }
    }, 300)
  }

  const onEditorChange = (value) => {
    console.log('onEditorChange');
    if (checkOverflow(wrapEditorRef.current)) {
      console.log(editorRef.current.targetElm)
      dispatch(handleOnBeforeEditorChange(id, editorRef.current.targetElm.lastChild.outerHTML));
      // wrapEditorRef.current.firstChild.innerHTML = value.replaceAll('<p>&nbsp;</p>', '');
      return;
    } else {
      // onChangeContent(id, value);
    }
    if (!value) {
      dispatch(handleDeleteBlockEditor(id));
    }
  }

  const handleExecCommand = (event, editor) => {
    console.log(handleExecCommand);
    console.log('event', event);
    console.log('editor', editor);
    // props.onExecCommand(event, editor)
  }

  const valueComputed = () => {
    // const tempDiv = document.createElement('div')
    // tempDiv.innerHTML = props.value
    // const spanNodeList = tempDiv.querySelectorAll('[data-name='dynamic-token']')
    // if (!spanNodeList.length) {
    //   setInnerValue(props.value)
    //   return
    // }

    // spanNodeList.forEach(span => {
    //   const tokenKey = span.dataset.key
    //   if (!proposalTokensMap[tokenKey]) return
    //   span.innerText = proposalTokensMap[tokenKey].value
    // })

    // setInnerValue(tempDiv.innerHTML)
  }

  // run it at a second time change value
  // useEffect(() => {
  //   if (!editorRef.current.editor) {
  //     return
  //   }

  //   if (typeof props.onInit !== 'function') {
  //     return
  //   }

  //   valueComputed()
  //   // eslint-disable-next-line
  // }, [tinyUUID])

  // if (window.tinyEventDispatcher) {
  //   window.tinyEventDispatcher.on(ON_CHANGE_CHECK_LIST, () => {
  //     const { activeEditor } = window.tinymce
  //     const isBlock = activeEditor.settings.blockOrder === blockOrder
  //     const isItem = activeEditor.settings.itemOrder === order
  //     if (isBlock && isItem) {
  //       props.onKeyUp(EVENT_CHECKLIST, activeEditor)
  //     }
  //   })
  // }

  const onBeforeSetContent = (e) => {
    console.log('onBeforeSetContent', e);
  };

  return (
    <div className={classes.join(' ')}>
      <EditorWrapper className='editor-wrapper' ref={wrapEditorRef}>
        <Editor
          disabled={props.disabled}
          tinymceScriptSrc={TINY_MCE_SRC}
          ref={editorRef}
          value={innerValue}
          autoFocus={true}
          inline
          init={{
            ...InitEdior,
            ...initProp,
            blockOrder,
            itemOrder: order,
            item,
            block,
          }}
          apiKey={TINY_API_KEY}
          onInit={(evt, editor) => {
            editorRef.current = editor;
            console.log('id', editor);
            dispatch(initEditorRef(id, editor));
          }}
          onEditorChange={onEditorChange}
          onKeyUp={props.onKeyUp}
          onBeforeSetContent={onBeforeSetContent}
          onSelectionChange={props.onSelectionChange}
          onBlur={handleOnBlur}
          style={{ outline: 'none' }}
          onClick={props.onClick}
          onExecCommand={handleExecCommand}
          onMouseUp={props.onMouseUp}
          onObjectResized={props.onObjectResized}
          onObjectResizeStart={props.onObjectResizeStart}
        />
      </EditorWrapper>
      <button
        onClick={() => {
          //editorRef.current.focus();
          setCursor(editorRef.current);
        }}
      >On focus</button>
      <button
        onClick={(e) => {
          console.log(editorRef.current.getContent());
        }}
      >On Saved</button>
    </div>
  )
});

// TinymceCustom.propTypes = {
//   id: PropTypes.string,
//   value: PropTypes.string,
//   showToolbar: PropTypes.bool,
//   onEditorChange: PropTypes.func,
//   onExecCommand: PropTypes.func,
//   onFocus: PropTypes.func,
//   onKeyPress: PropTypes.func,
//   onOutFocus: PropTypes.func,
//   onKeyUp: PropTypes.func,
//   onSelectionChange: PropTypes.func,
//   onBlur: PropTypes.func,
//   onInit: PropTypes.func,
//   onClick: PropTypes.func,
//   defaultText: PropTypes.string,
//   Toolbar: PropTypes.elementType,
//   toolbarKey: PropTypes.string,
//   disabled: PropTypes.bool,
//   tinyType: PropTypes.string,
//   initProp: PropTypes.object,
//   onObjectResized: PropTypes.func,
//   onObjectResizeStart: PropTypes.func,
// }

// TinymceCustom.defaultProps = {
//   onClick: () => { },
//   onFocus: () => { },
// }

const EditorWrapper = styled.div`
  .mce-content-body {
    outline: none;
    font-family: inherit;
    font-size: inherit;
    p {
      margin: 0px;
    }
  }
  .mce-content-body table td,
  .mce-content-body table th {
    border: 1px solid #aaa;
    border-collapse: collapse;
    font-family: inherit;
    font-size: inherit;
  }

  .tox .tox-pop__dialog {
    padding: 15px;
  }
`;

export default TinymceCustom;
