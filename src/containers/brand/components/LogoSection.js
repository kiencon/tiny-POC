import { makeStyles } from '@material-ui/core';
import React, { Fragment } from 'react';
import AddIcon from '@material-ui/icons/Add';
import Skeleton from '@material-ui/lab/Skeleton';
import styled from 'styled-components';
import ButtonUpload from './ButtonUpload';
import { FILE_TYPES, IMAGE_ACCEPT } from '../../../config/constant';
import { fileAcceptToString } from '../utils/func';

const useStyles = makeStyles(() => ({
  skeleton: {
    display: 'inline-block',
    borderRadius: '4px',
  },
}));

const LogoSection = ({
  dispatch, informationLogo, isLoading, typeFileUploading,
}) => {
  const classes = useStyles();

  return (
    <WrapLogo>
      <ButtonUpload
        icon={{ Icon: AddIcon }}
        size="small"
        shape="circle"
        accept={fileAcceptToString(IMAGE_ACCEPT)}
        type="file"
        typeFileUpload={FILE_TYPES.logo}
        dispatch={dispatch}
      />
      {informationLogo.length ? (
        informationLogo.map((logo, index) => (
          <Fragment key={logo.url}>
            <WrapperElement>
              <Img src={logo.url} alt={decodeURIComponent(logo.label)} />
            </WrapperElement>
            {index === informationLogo.length - 1 && <br />}
          </Fragment>
        ))
      ) : (
        <>
          {!isLoading && (
            <Content>
              JPG or PNG are allowed. Bitmap need to be at least 512x512 pixels or higher.
            </Content>
          )}
        </>
      )}
      {(isLoading && typeFileUploading === FILE_TYPES.logo) && (
        <WrapperElement>
          <Skeleton variant="rect" width={40} height={40} className={classes.skeleton} />
        </WrapperElement>
      )}
    </WrapLogo>
  );
};

const WrapLogo = styled.div`
  display: block;
`;
const WrapperElement = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
  margin-right: 8px;
  max-height: 52px;
  max-width: 192px;
  border-radius: 4px;
  padding: 4px 0px;
  height: 100%;
`;
const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 52px;
  max-width: 404px;
  padding: 4px 0px;
  font-family: Roboto;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #8f9bb3;
`;
const Img = styled.img`
  height: 40px;
  max-height: 40px;
  max-width: 192px;
  object-fit: contain;
`;

export default LogoSection;
