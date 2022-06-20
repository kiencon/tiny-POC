import {
  Button,
  makeStyles,
  Popover,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import ThreeDotIcon from '@material-ui/icons/MoreHorizOutlined';
import { deleteTemplate } from '../../design/state/action';
import { E_SIGN_UPLOAD_URL } from '../../../routes/constRoute';
import { getLabel } from '../utils/func';

const useStyles = makeStyles(() => ({
  typographyEsign: {
    width: '200px',
    height: '40px',
    padding: '10px 16px',
    backgroundColor: '#ffffff',
    fontFamily: 'Roboto',
    fontSize: '15px',
    fontWeight: '500',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.33,
    letterSpacing: 'normal',
    color: '#222b45',
    cursor: 'pointer',
    '&:hover': {
      color: 'rgb(44,131,235)',
    },
  },
  buttonEsignAction: {
    minWidth: '100%',
    width: '100%',
    height: '100%',
    padding: 0,
    backgroundColor: '#ffffff',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#222b45',
      boxShadow: 'none',
    },
    '&:hover span > svg': {
      color: '#ffffff!important',
    },
  },
  popover: {
    '& .MuiPopover-paper': {
      boxShadow: 'none!important',
      borderRadius: '4px',
      border: 'solid 1px #c5cee0',
      marginTop: '2px',
    },
  },
  threeDotIcon: {
    color: '#222b45',
  },
}));

const EsignSection = ({ dispatch, informationEsign }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [esignActionIndex, setEsignActionIndex] = useState(-1);
  const open = Boolean(anchorEl);
  const idEsign = open ? 'simple-popover' : undefined;

  const handleEsignAction = (e, index) => {
    setEsignActionIndex(index);
    setAnchorEl(e.currentTarget);
  };
  const handleEsignActionClose = () => {
    setEsignActionIndex(-1);
    setAnchorEl(null);
  };
  const handleDeleteEsign = esign => {
    const { id, categoryId, activityId } = esign;
    const queryParams = {};
    const searchStr = '';
    dispatch(deleteTemplate({
      id, categoryId, activityId, queryParams, searchStr,
    }));
  };
  const handleReusedEsign = () => {
    window.location.href = E_SIGN_UPLOAD_URL;
  };

  return (
    <Wrap>
      {informationEsign.map((esign, index) => (
        <WrapEsign key={esign.id}>
          <EsignLabel>{getLabel(esign.name)}</EsignLabel>
          <ButtonEsignAction>
            <Button
              className={classes.buttonEsignAction}
              aria-describedby={idEsign}
              variant="contained"
              color="primary"
              onClick={e => handleEsignAction(e, index)}
              style={{ backgroundColor: (esignActionIndex === index && open) && '#222b45' }}
            >
              <ThreeDotIcon
                className={classes.threeDotIcon}
                style={{ color: (esignActionIndex === index && open) && '#ffffff' }}
              />
            </Button>
            {esignActionIndex === index && (
              <WrapPopover>
                <Popover
                  id={idEsign}
                  className={classes.popover}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleEsignActionClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <Typography className={classes.typographyEsign} onClick={handleReusedEsign}>Re-used</Typography>
                  <Typography
                    className={classes.typographyEsign}
                    onClick={() => handleDeleteEsign(esign)}
                  >
                    Move To Trash
                  </Typography>
                </Popover>
              </WrapPopover>
            )}
          </ButtonEsignAction>
        </WrapEsign>
      ))}
    </Wrap>
  );
};

const Wrap = styled.div`
  margin-bottom: 50px;
`;
const WrapEsign = styled.div`
  width: 461px;
  height: 68px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media only screen and (max-width: 960px) {
    width: 100%;
  }
`;
const ButtonEsignAction = styled.div`
  width: 40px;
  height: 40px;
`;
const EsignLabel = styled.p`
  margin: 0;
  font-family: Roboto;
  font-size: 15px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  color: #222b45;
`;
const WrapPopover = styled.div`
  position: relative;
`;

export default EsignSection;
