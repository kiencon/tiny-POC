import { makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Close';
import { useSelector } from 'react-redux';
import { NAME_SECTION, FILE_TYPES, FONT_PICKER_INSIDE } from '../../../config/constant';
import useClickAwayListener from '../../../hooks/useClickAwayListener';
import ButtonTypeSelect from './ButtonTypeSelect';
import { updateFonts } from '../state/action';
import * as selector from '../state/selector';
import useWindowSize from '../../../hooks/useWindowSize';

const useStyles = makeStyles(() => ({
  removeIcon: {
    width: '24px',
    height: '24px',
  },
}));

const FontSection = ({ informationCompany, dispatch }) => {
  const classes = useStyles();
  const { ref } = useClickAwayListener();
  const [isAdd, setAdd] = useState(false);
  const [fontSelected, setFontSelected] = useState([]);
  const [, windowSize] = useWindowSize();
  const isMobile = windowSize.width < 960;
  const { fontsUploaded } = useSelector(state => ({
    fontsUploaded: selector.selectFiles(state, FILE_TYPES.font),
  }));

  const handleSelected = fontSelect => {
    const fontPickIsExist = fontSelected.find(font => font.name === fontSelect.name);
    if (!fontPickIsExist) {
      const newFontSelected = [...fontSelected, fontSelect];
      setFontSelected(newFontSelected);
      dispatch(updateFonts(newFontSelected));
    }
    setAdd(false);
  };
  const handleRemoveFontSelected = index => {
    const newFontSelected = [...fontSelected.slice(0, index), ...fontSelected.slice(index + 1)];
    setFontSelected(newFontSelected);
    dispatch(updateFonts(newFontSelected));
  };
  const handleClosePicker = () => {
    setAdd(false);
  };

  useEffect(() => {
    const dataFound = informationCompany.find(section => section.name.toLowerCase() === NAME_SECTION.fonts);
    if (dataFound) {
      setFontSelected(JSON.parse(dataFound.value));
    }
  }, [informationCompany]);
  useEffect(() => {
    if (fontsUploaded.length !== 0) {
      const styles = Array.from(document.querySelectorAll('[media="all,print,screen"]'));
      const checkStyleIsExist = url => styles.find(style => style.innerHTML.includes(url));
      fontsUploaded.forEach(font => {
        const { url, label } = font;
        if (!checkStyleIsExist(url)) {
          const style = document.createElement('style');
          style.type = 'text/css';
          style.media = 'all,print,screen';
          style.innerHTML = `@font-face{font-family:'${label}';src:url(${url})format('truetype');}`;
          document.head.appendChild(style);
        }
      });
    }
  });
  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setAdd(false);
      } else {
        const checkInsideFontPicker = FONT_PICKER_INSIDE.find(className => (
          e.target.className.toString().includes(className)
        ));
        if (!checkInsideFontPicker) {
          setAdd(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <Wrap ref={ref}>
      <ButtonTypeSelect
        icon={{ Icon: AddIcon }}
        size="small"
        shape="circle"
        isAdd={isAdd}
        setAdd={setAdd}
        typeSelect={NAME_SECTION.fonts}
        handleSelected={handleSelected}
        handleClosePicker={handleClosePicker}
        isMobile={isMobile}
      />
      {fontSelected.map((font, index) => (
        <WrapperElement key={font.name}>
          <Element style={{ fontFamily: font.font, fontWeight: font.weight }}>{font.name}</Element>
          <ButtonRemove onClick={() => handleRemoveFontSelected(index)}>
            <RemoveIcon className={classes.removeIcon} />
          </ButtonRemove>
        </WrapperElement>
      ))}
    </Wrap>
  );
};

const Wrap = styled.div`
  display: block;
`;
const WrapperElement = styled.div`
  float: left;
  margin-top: 2px;
  margin-bottom: 2px;
  margin-right: 8px;
  height: 48px;
  border-radius: 24px;
  background-color: #edf1f7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 4px;
`;
const Element = styled.p`
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  color: #222b45;
  margin: 0 16px 0 24px;
  text-transform: capitalize;
`;
const ButtonRemove = styled.div`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 24px;
  width: 40px;
  height: 40px;
`;

export default FontSection;
