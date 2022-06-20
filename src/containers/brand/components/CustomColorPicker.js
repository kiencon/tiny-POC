import React, { useEffect } from 'react';
import { CustomPicker } from 'react-color';
import {
  EditableInput,
  Hue,
  Saturation,
} from 'react-color/lib/components/common';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Check';
import styled from 'styled-components';
import { COLOR_PICKER_INSIDE } from '../../../config/constant';

export const CustomColorPicker = ({
  hex,
  hsl,
  hsv,
  onChange,
  customColorPickerStyle,
  isMobile,
  handleClosePicker,
  handleSelected,
}) => {
  useEffect(() => {
    const pointer = document.getElementsByClassName(COLOR_PICKER_INSIDE[0])[1];
    pointer.addEventListener('mousedown', () => {
      pointer.style.cursor = 'none';
    });
    pointer.addEventListener('mouseup', () => {
      pointer.style.cursor = 'pointer';
    });
    pointer.addEventListener('mouseleave', () => {
      pointer.style.cursor = 'pointer';
    });
  }, []);

  return (
    <WrapColorPicker className={COLOR_PICKER_INSIDE[0]} style={customColorPickerStyle}>
      {isMobile && (
        <WrapButton>
          <CloseIcon onClick={handleClosePicker} />
          <DoneIcon style={{ color: '#2c83eb' }} onClick={handleSelected} />
        </WrapButton>
      )}
      <WrapSaturation
        className={COLOR_PICKER_INSIDE[0]}
      >
        <Saturation hsl={hsl} hsv={hsv} onChange={onChange} />
      </WrapSaturation>
      <WrapHue className={COLOR_PICKER_INSIDE[0]}>
        <Hue hsl={hsl} onChange={onChange} />
      </WrapHue>
      <WrapEditableInput className={COLOR_PICKER_INSIDE[0]}>
        <EditableInput
          value={hex}
          onChange={onChange}
        />
      </WrapEditableInput>
    </WrapColorPicker>
  );
};

const WrapButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-item: center;
  height: 44px;
`;
const WrapColorPicker = styled.div`
  background-color: #ffffff;
  @media only screen and (min-width: 961px) {
    width: 280px;
    height: 227px;
    padding: 24px 16px;
    position: absolute;
    z-index: 2;
    border-radius: 4px;
    border: solid 1px #e6e6e6;
    &:hover {
      position: relative;
    }
  }
  @media only screen and (max-width: 960px) {
    width: 100%;
    height: 100%;
    padding: 12px 16px;
    position: fixed;
    z-index: 3;
    border: none;
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
`;
const WrapSaturation = styled.div`
  width: 100%;
  height: 115px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  div {
    border-radius: 4px;
    div {
      pointer-events: none;
      div:nth-child(2) {
        width: 0px;
        cursor: none!important;
        transition-duration: 100ms;
        transition-timing-function: ease-out;
        animation: cursorAnim .5s infinite alternate;
        pointer-events: none;
        div {
          width: 14px!important;
          height: 14px!important;
          border: 3px solid #ffffff;
          box-shadow: none!important;
          transform: translate(-7px, -7px)!important;
          pointer-events: none;
        }
      }
    }
  }
  &:after {
    content: "";
    cursor: none;
    position: absolute;
  }
  &:before {
    content: "";
    cursor: none;
    position: absolute;
  }
`;
const WrapHue = styled.div`
  height: 12px;
  position: relative;
  div {
    div {
      border-radius: 24px;
      cursor: pointer;
      height: 100%;
      padding: 0;
      border-right: 10px solid transparent;
      div > div {
        border-radius: 24px!important;
        width: 10px!important;
        height: 10px!important;
        cursor: pointer;
        transform: none!important;
      }
    }
  }
  @media only screen and (min-width: 961px) {
    margin: 7px 15px;
  }
  @media only screen and (max-width: 960px) {
    margin: 23px 15px;
  }
`;
const WrapEditableInput = styled.div`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  border: solid 1px #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    width: 100%;
    height: 100%;
    input {
      border: none;
      width: 100%;
      height: 100%;
      font-family: Roboto;
      font-size: 15px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.33;
      letter-spacing: normal;
      text-align: center;
      color: #222b45;
      &:focus {
        border-radius: 4px;
        border: solid 1px #2c83eb;
      }
    };
  }
`;

export default CustomPicker(CustomColorPicker);
