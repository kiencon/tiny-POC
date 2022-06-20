import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';
import { signedUrlFile } from '../state/action';
import { IMAGE_ACCEPT } from '../../../config/constant';
import { toastrFail } from '../../../components/common/toastCustom';

const useStyles = makeStyles(() => ({
  iconBig: {
    fontSize: '32px',
    color: '#8f9bb3',
  },
  iconSmall: {
    fontSize: '24px',
    color: '#222b45',
  },
  iconSmallInfo: {
    fontSize: '24px',
    color: '#8f9bb3',
  },
  buttonBig: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
    },
  },
  buttonSmall: {
    padding: 0,
    minWidth: 0,
    width: '52px',
    borderRadius: '24px',
    '&:hover': {
      backgroundColor: '#ffffff',
    },
  },
  buttonSmallInfo: {
    padding: 0,
    minWidth: 0,
    width: '40px',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
    },
  },
  inputUpload: {
    display: 'none',
  },
  smallWrapper: {
    height: '100%',
  },
  smallInfoWrapper: {
    height: '40px',
    margin: '8px 0 0 8px',
  },
  iconWrapSmall: {
    boxShadow: 'none!important',
    width: '48px',
    height: '48px',
    padding: '11px',
  },
  iconWrapSmallInfo: {
    width: '40px',
    height: '40px',
    padding: '7px',
  },
  circleShape: {
    border: 'dashed 1px #8f9bb3',
    borderRadius: '24px',
    boxShadow: 'inset 0 0 0 1px rgba(16, 20, 38, 0.1)',
  },
  squareShape: {
    border: 'dashed 1px #8f9bb3',
    borderRadius: '4px',
    boxShadow: 'inset 0 0 0 1px rgba(16, 20, 38, 0.1)',
  },
}));

const ButtonUpload = ({
  icon, size, shape, accept, type, typeFileUpload, dispatch,
}) => {
  const classes = useStyles();
  const sizePrototype = {
    small: classes.smallWrapper,
    smallInfo: classes.smallInfoWrapper,
  };
  const buttonSizePrototype = {
    small: classes.buttonSmall,
    smallInfo: classes.buttonSmallInfo,
    big: classes.buttonBig,
  };
  const iconPrototype = {
    small: classes.iconWrapSmall,
    smallInfo: classes.iconWrapSmallInfo,
  };
  const iconSizePrototype = {
    small: classes.iconSmall,
    smallInfo: classes.iconSmallInfo,
    big: classes.iconBig,
  };
  const shapePrototype = {
    circle: classes.circleShape,
    square: classes.squareShape,
  };
  const inputPrototype = {
    file: classes.inputUpload,
  };

  const handleFileSelect = e => {
    const fileData = e.target.files[0];
    const fileExt = fileData.name.split('.')[1];
    fileData.typeFileUpload = typeFileUpload;
    const checkImageAccept = IMAGE_ACCEPT.find(imgAccept => imgAccept === fileExt);

    const URL = window.URL || window.webkitURL;
    const img = new Image();
    const objectUrl = URL.createObjectURL(fileData);
    img.onload = function getDimension() {
      const { width, height } = img;
      fileData.width = width;
      fileData.height = height;
    };
    img.src = objectUrl;

    if (checkImageAccept) {
      dispatch(signedUrlFile(fileData));
    } else {
      toastrFail(`Only support .${IMAGE_ACCEPT.join(', .')}`);
    }
    e.target.value = null;
  };

  return (
    <Wrapper className={sizePrototype[size]}>
      <label htmlFor="contained-button-file">
        <input
          accept={accept}
          className={inputPrototype[type]}
          id="contained-button-file"
          multiple={false}
          type={type}
          onChange={event => handleFileSelect(event)}
        />
        <Button
          component="span"
          className={buttonSizePrototype[size]}
          disableElevation
        >
          <WrapperIcon>
            <Icon
              className={`${iconPrototype[size]} ${shapePrototype[shape]}`}
            >
              <icon.Icon
                className={iconSizePrototype[size]}
              />
            </Icon>
          </WrapperIcon>
        </Button>
      </label>
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
  border: dashed 1px #c5cee0;
  box-shadow: none!important;
`;

export default ButtonUpload;
