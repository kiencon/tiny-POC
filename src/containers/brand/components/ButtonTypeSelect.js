import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import ColorPicker from './CustomColorPicker';
import FontSelect from './FontSelect';
import useClickAwayListener from '../../../hooks/useClickAwayListener';
import { NAME_SECTION } from '../../../config/constant';

const useStyles = makeStyles(() => ({
  iconSmall: {
    fontSize: '24px',
    color: '#222b45',
  },
  buttonSmall: {
    padding: 0,
    minWidth: 0,
    minHeight: '52px',
    width: '52px',
    borderRadius: '24px',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
    },
  },
  smallWrapper: {
    height: '100%',
  },
  iconWrapSmall: {
    boxShadow: 'none!important',
    width: '48px',
    height: '48px',
    padding: '11px',
  },
  circleShape: {
    border: 'dashed 1px #8f9bb3',
    borderRadius: '24px',
    boxShadow: 'inset 0 0 0 1px rgba(16, 20, 38, 0.1)',
  },
}));

const ButtonTypeSelect = ({
  icon,
  size,
  shape,
  isAdd,
  setAdd,
  colorPick,
  handleChange,
  typeSelect,
  handleSelected,
  handleClosePicker,
  isMobile,
}) => {
  const classes = useStyles();
  const { ref } = useClickAwayListener();

  const sizePrototype = {
    small: classes.smallWrapper,
  };
  const buttonSizePrototype = {
    small: classes.buttonSmall,
  };
  const iconPrototype = {
    small: classes.iconWrapSmall,
  };
  const iconSizePrototype = {
    small: classes.iconSmall,
  };
  const shapePrototype = {
    circle: classes.circleShape,
  };

  const customColorPickerStyle = {
    top: isMobile ? 0 : '-181px',
    left: isMobile ? 0 : '-115px',
    position: isMobile ? 'fixed' : 'absolute',
  };

  const handleShowTypeSelect = () => {
    setAdd(true);
  };

  return (
    <Wrapper className={sizePrototype[size]}>
      <Button
        ref={ref}
        component="span"
        className={buttonSizePrototype[size]}
        onClick={handleShowTypeSelect}
        disableElevation
      >
        <WrapperIcon>
          <Icon
            className={`${iconPrototype[size]} ${shapePrototype[shape]}`}
            style={{ border: isAdd && 'dashed 1px #2c83eb' }}
          >
            <icon.Icon
              className={`${iconSizePrototype[size]}`}
              style={{ color: isAdd && '#2c83eb' }}
            />
          </Icon>
        </WrapperIcon>
      </Button>
      {isAdd && (
        <>
          {typeSelect === NAME_SECTION.fonts && (
            <FontSelect
              handleSelected={handleSelected}
              handleClosePicker={handleClosePicker}
              isMobile={isMobile}
            />
          )}
          {typeSelect === NAME_SECTION.colors && (
            <ColorPicker
              color={colorPick}
              onChange={handleChange}
              customColorPickerStyle={customColorPickerStyle}
              isMobile={isMobile}
              handleClosePicker={handleClosePicker}
              handleSelected={handleSelected}
            />
          )}
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: fit-content;
  float: left;
  margin-right: 8px;
  height: 88px;
`;
const WrapperIcon = styled.div`
  display: flex;
  align-items: center;
`;
const Icon = styled.div`
  position: relative;
  width: 88px;
  height: 88px;
  padding: 27px;
  border-radius: 4px;
  border: dashed 1px #8f9bb3;
  box-shadow:
`;

export default ButtonTypeSelect;
