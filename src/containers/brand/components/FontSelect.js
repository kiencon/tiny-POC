import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  FILE_TYPES,
  FONTS_EXISTING,
  FONT_ACCEPT,
  FONT_PICKER_INSIDE,
} from '../../../config/constant';
import CircleProgress from '../../../components/common/CircleProgress';
import * as selector from '../state/selector';
import { signedUrlFile } from '../state/action';
import { toastrFail } from '../../../components/common/toastCustom';

const useStyles = makeStyles(() => ({
  buttonUploadFont: {
    boxShadow: 'none',
    width: '100%',
    height: '40px',
    borderRadius: '4px',
    border: 'solid 1px #222b45',
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 'bold',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.14,
    letterSpacing: 'normal',
    color: '#222b45',
    backgroundColor: '#ffffff',
    textTransform: 'capitalize',
    '&:hover': {
      color: '#ffffff',
      backgroundColor: '#222b45',
    },
  },
  buttonUploadFontProgress: {
    boxShadow: 'none',
    width: '100%',
    height: '40px',
    borderRadius: '4px',
    backgroundColor: '#222b45',
    color: '#ffffff',
    '&:hover': {
      color: '#ffffff',
      backgroundColor: '#222b45',
    },
  },
  inputUpload: {
    display: 'none',
  },
}));

const FontSelect = React.memo(({
  handleSelected,
  handleClosePicker,
  isMobile,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [fontsSorted, setFontsSorted] = useState([]);

  const { fontsUploaded, isFileLoading, typeFileUploading } = useSelector(state => ({
    fontsUploaded: selector.selectFiles(state, FILE_TYPES.font),
    isFileLoading: selector.selectIsloading(state),
    typeFileUploading: selector.selectTypeFileUploading(state),
  }));

  const handleFileSelect = e => {
    const fileData = e.target.files[0];
    fileData.typeFileUpload = FILE_TYPES.font;
    const checkFontUploadExist = fontsUploaded.find(font => (
      decodeURIComponent(font.label) === fileData.name.split('.')[0]
    ));
    const checkFontAccept = FONT_ACCEPT.find(accept => accept === fileData.name.split('.')[1]);
    if (!checkFontAccept) {
      toastrFail(`Only support .${FONT_ACCEPT.join(', .')}`);
      return;
    }
    if (checkFontUploadExist) {
      toastrFail('This file already exists');
      return;
    }
    if (!checkFontUploadExist && checkFontAccept) {
      dispatch(signedUrlFile(fileData));
    }
    e.target.value = null;
  };

  useEffect(() => {
    const sortable = Object.entries(FONTS_EXISTING)
      .sort(([, a], [, b]) => a.localeCompare(b));
    setFontsSorted(sortable);
  }, []);

  return (
    <WrapFontSelect className={FONT_PICKER_INSIDE[0]}>
      {isMobile && (
        <WrapButton>
          <ExpandMoreIcon onClick={handleClosePicker} />
        </WrapButton>
      )}
      <label htmlFor="contained-button-font-select">
        <input
          type="file"
          accept=".ttf"
          className={classes.inputUpload}
          id="contained-button-font-select"
          multiple={false}
          onChange={event => event.target.files.length && handleFileSelect(event)}
        />
        <Button
          component="span"
          className={`${isFileLoading && typeFileUploading === FILE_TYPES.font
            ? classes.buttonUploadFontProgress
            : classes.buttonUploadFont} ${FONT_PICKER_INSIDE[0]}`}
          startIcon={!isFileLoading && typeFileUploading === FILE_TYPES.font && <CloudUploadIcon />}
          disableElevation
        >
          {isFileLoading && typeFileUploading === FILE_TYPES.font ? <CircleProgress /> : 'Upload Your Font'}
        </Button>
      </label>
      {!!fontsUploaded.length && (
        <TipLabel>Choice the uploaded font</TipLabel>
      )}
      {fontsUploaded.map(font => (
        <WrapFont
          key={font.label}
          className={FONT_PICKER_INSIDE[0]}
          style={{ fontFamily: `'${font.label}'` }}
          onClick={() => handleSelected({
            font: `'${font.label}'`, name: decodeURIComponent(font.label),
          })}
        >
          {decodeURIComponent(font.label)}
        </WrapFont>
      ))}
      <TipLabel>Or choice one below</TipLabel>
      {fontsSorted.map(font => (
        <WrapFont
          key={font[1]}
          className={FONT_PICKER_INSIDE[0]}
          style={{ fontFamily: font[0] }}
          onClick={() => handleSelected({ font: font[0], name: font[1] })}
        >
          {font[1]}
        </WrapFont>
      ))}
    </WrapFontSelect>
  );
});
const WrapButton = styled.div`
  height: 44px;
  @media only screen and (max-width: 960px) {
    svg {
      animation: fade-in-move-up .5s;
      @keyframes fade-in-move-up {
        0% {
          transform: rotate(180deg);
        }
        100% {
          transform: rotate(90deg);
        }
      }
    }
  }
`;
const WrapFontSelect = styled.div`
  top: -277px;
  left: -115px;
  width: 280px;
  height: 324px;
  padding: 25px 16px;
  border-radius: 4px;
  border: solid 1px #e6e6e6;
  background-color: #ffffff;
  z-index: 2;
  position: absolute;
  overflow: scroll;
  ::-webkit-scrollbar-thumb {
    border: none;
    background-color: transparent;
  }
  :hover {
    ::-webkit-scrollbar-thumb {
      border: none;
      background-color: #A0A0A5;
    }
  }
  @media only screen and (max-width: 960px) {
    position: fixed;
    top: 0;
    overflow: scroll;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    animation: fade-in-move-up .5s
  }
  @keyframes fade-in-move-up {
    0% {
      top: 100vh;
    }
    100% {
      top: 0;
    }
  }
  // @keyframes fade-in-move-down {
  //   0% {
  //     top: 0;
  //   }
  //   100% {
  //     top: 100vh;
  //   }
  // }
`;
const TipLabel = styled.p`
  margin: 15px 0;
  font-family: Roboto;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #8f9bb3;
`;
const WrapFont = styled.p`
  width: 100%;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #222b45;
  font-size: 15px;
  margin-bottom: 20px;
  text-transform: capitalize;
  cursor: pointer;
  :hover {
    color: rgb(44, 131, 235);
  }
  :last-child {
    margin-bottom: 0;
  }
`;

export default FontSelect;
