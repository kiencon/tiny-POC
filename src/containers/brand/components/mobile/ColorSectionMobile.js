import { makeStyles, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NAME_SECTION } from '../../../../config/constant';
import useClickAwayListener from '../../../../hooks/useClickAwayListener';
import ButtonTypeSelect from '../ButtonTypeSelect';
import ColorPicker from '../CustomColorPicker';
import { updateColors } from '../../state/action';

const useStyles = makeStyles(() => ({
  closeIcon: {
    color: '#222b45',
    width: '16px',
  },
}));
const useStylesColorTooltip = makeStyles(() => ({
  arrow: {
    color: '#222b45',
    top: '2px!important',
    position: 'absolute!important',
  },
  tooltip: {
    padding: '4px 8px 2px 8px',
    alignItem: 'center',
    borderRadius: '2px',
    backgroundColor: '#222b45',
    fontFamily: 'Roboto',
    fontSize: '15px',
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.33,
    letterSpacing: 'normal',
    textAlign: 'center',
    color: '#ffffff',
    top: '-14px!important',
    zIndex: 2,
  },
}));

const ColorSectionMobile = ({ informationCompany, dispatch, isMobile }) => {
  const classes = useStyles();
  const [colorPickerIndex, setColorPickerIndex] = useState('');
  const [colorPick, setColorPick] = useState('');
  const [isAdd, setAdd] = useState(false);
  const { ref } = useClickAwayListener();
  const [colorHover, setColorHover] = useState('');

  const customColorPickerStyle = {
    top: 0,
    left: 0,
  };
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const dataFound = informationCompany.find(section => section.name.toLowerCase() === NAME_SECTION.colors);
    if (dataFound) {
      setColors(JSON.parse(dataFound.value));
    }
  }, [informationCompany]);

  const handleChange = color => {
    if (color) {
      setColorPick(color.hex);
    }
  };
  const handleRemoveColor = index => {
    const newColors = [...colors.slice(0, index), ...colors.slice(index + 1)];
    setColors(newColors);
    dispatch(updateColors(newColors));
  };
  const handleShowColorPicker = index => {
    setColorPick(colors[index]);
    setColorPickerIndex(index);
    setColorHover('');
  };
  const handleSelected = () => {
    const colorPickIsExist = colors.find(color => color === colorPick);
    if (colorPick && !colorPickIsExist) {
      if (isAdd) {
        const newColors = [colorPick, ...colors];
        setColors(newColors);
        dispatch(updateColors(newColors));
      } else if (!isAdd && colorPickerIndex !== '') {
        colors.splice(colorPickerIndex, 1, colorPick);
        dispatch(updateColors(colors));
      }
    } else if (!colors.length && isAdd) {
      const newColors = [colorPick || '#000000'];
      setColors(newColors);
      dispatch(updateColors(newColors));
    }
    setAdd(false);
    setColorPickerIndex('');
  };
  const handleClosePicker = () => {
    setAdd(false);
    setColorPickerIndex('');
  };

  const ColorTooltip = props => {
    const classesColor = useStylesColorTooltip();
    return <Tooltip arrow className="colorTooltip" classes={classesColor} {...props} />;
  };

  return (
    <Wrap>
      <ButtonTypeSelect
        icon={{ Icon: AddIcon }}
        size="small"
        shape="circle"
        isAdd={isAdd}
        setAdd={setAdd}
        colorPick={colorPick}
        handleChange={handleChange}
        typeSelect={NAME_SECTION.colors}
        isMobile={isMobile}
        handleClosePicker={handleClosePicker}
        handleSelected={handleSelected}
      />
      {colors && colors.map((color, index) => (
        <Section key={color}>
          <ButtonClose type="button" onClick={() => handleRemoveColor(index)}>
            <Oval>
              <CloseIcon className={classes.closeIcon} />
            </Oval>
          </ButtonClose>
          <WrapperElement
            ref={ref}
            onClick={() => handleShowColorPicker(index)}
            onMouseLeave={() => setColorHover('')}
            onMouseEnter={e => setColorHover(e.target.getAttribute('data-color'))}
            data-color={color}
          >
            <ColorTooltip open={colorHover === color} title={color.toUpperCase()}>
              <Element
                style={{
                  backgroundColor: `${
                    colorPickerIndex === index ? colorPick : color
                  }`,
                }}
              />
            </ColorTooltip>
          </WrapperElement>
          {colorPickerIndex === index && (
            <ColorPicker
              color={colorPickerIndex === index && colorPick}
              onChange={handleChange}
              customColorPickerStyle={customColorPickerStyle}
              isMobile={isMobile}
              handleClosePicker={handleClosePicker}
              handleSelected={handleSelected}
            />
          )}
        </Section>
      ))}
    </Wrap>
  );
};

const Wrap = styled.div`
  display: block;
`;
const Section = styled.div`
  float: left;
  margin-right: 8px;
  height: 52px;
  width: 52px;
  &:hover {
    position: relative;
    border-radius: 24px;
    box-shadow: inset 0 0 0 2px var(--greyscale-white);
    border: solid 1px #2c83eb;
    & button {
      position: absolute;
      display: initial;
      z-index: 1;
      right: -3px;
      top: -3px;
    }
  }
`;
const WrapperElement = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: center;
  padding: 2px;
  cursor: pointer;
  .colorTooltip {
    pointer-events: none;
  }
`;
const Element = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 11px 16px;
  border-radius: 24px;
  box-shadow: inset 0 0 0 1px rgba(16, 20, 38, 0.1);
`;
const ButtonClose = styled.button`
  display: none;
`;
const Oval = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #f7f9fc;
  border-radius: 50%;
`;

export default ColorSectionMobile;
