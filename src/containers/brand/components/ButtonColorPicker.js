import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import ColorPicker from './CustomColorPicker';
import useClickAwayListener from '../../../hooks/useClickAwayListener';

const useStyles = makeStyles(() => ({
  iconSmall: {
    fontSize: '24px',
    color: '#222b45',
  },
  buttonSmall: {
    padding: 0,
    minWidth: 0,
    width: '52px',
    borderRadius: '24px',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
    },
  },
  smallWrapper: {
    height: '52px',
    alignItems: 'center',
    display: 'flex',
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

const ButtonColorPicker = ({
  icon,
  size,
  shape,
  isAdd,
  setAdd,
  colorPick,
  handleChange,
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
    top: '-181px',
    left: '-115px',
    position: 'absolute',
  };

  const handleShowColorPicker = () => {
    setAdd(true);
  };

  return (
    <Wrapper className={sizePrototype[size]}>
      <Button
        ref={ref}
        component="span"
        className={buttonSizePrototype[size]}
        onClick={handleShowColorPicker}
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
        <ColorPicker color={colorPick} onChange={handleChange} customColorPickerStyle={customColorPickerStyle} />
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

export default ButtonColorPicker;
