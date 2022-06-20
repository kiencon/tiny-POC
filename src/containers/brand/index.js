import { makeStyles } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ErrorPopup } from '../../components/common/ErrorPopup';
import { BRAND_TITLE, FILE_TYPES, NAME_SECTION } from '../../config/constant';
import BrandSection from './components/BrandSection';
import BrandNameSection from './components/BrandNameSection';
import ColorSection from './components/ColorSection';
import FontSection from './components/FontSection';
import InfoSection from './components/InfoSection';
import LibrarySection from './components/LibrarySection';
import LogoSection from './components/LogoSection';
import { getInformationBrand } from './state/action';
import * as selector from './state/selector';
import * as selectorDesign from '../design/state/selector';
import useWindowSize from '../../hooks/useWindowSize';
import ColorSectionMobile from './components/mobile/ColorSectionMobile';
import EsignSection from './components/EsignSection';
import { filterDesignTemplate } from '../design/state/action';

const useStyles = makeStyles(() => ({
  heading: {
    fontFamily: 'Roboto',
    fontSize: '22px',
    fontWeight: 'bold',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.45,
    letterSpacing: 'normal',
    color: '#222b45',
  },
  accordion: {
    boxShadow: 'none',
    width: '461px',
    marginTop: '5px!important',
    marginBottom: '19px!important',
    '&::before': {
      backgroundColor: 'rgb(0 0 0 / 0%)',
    },
    '@media only screen and (max-width: 960px)': {
      width: '100%',
    },
  },
  accordionSummary: {
    padding: 0,
    minHeight: 'fit-content!important',
    '& div': {
      margin: '0!important',
      padding: 0,
    },
  },
  accordionDetails: {
    '&.MuiAccordionDetails-root': {
      padding: '0!important',
    },
    '& section': {
      width: '100%',
    },
  },
  expandMoreIcon: {
    color: '#222b45',
  },
}));

const Brand = () => {
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState(false);
  const classes = useStyles();
  const [, windowSize] = useWindowSize();
  const isMobile = windowSize.width <= 960;
  const {
    informationCompany,
    informationLogo,
    isFileLoading,
    typeFileUploading,
    informationImage,
    informationVideo,
    informationAudio,
    informationEsign,
  } = useSelector(state => ({
    informationCompany: selector.selectInformationSection(state),
    informationLogo: selector.selectFiles(state, FILE_TYPES.logo),
    isFileLoading: selector.selectIsloading(state),
    typeFileUploading: selector.selectTypeFileUploading(state),
    informationImage: selector.selectFiles(state, FILE_TYPES.image),
    informationVideo: selector.selectFiles(state, FILE_TYPES.video),
    informationAudio: selector.selectFiles(state, FILE_TYPES.audio),
    informationEsign: selectorDesign.selectTemplates(state),
  }));

  useEffect(() => {
    dispatch(getInformationBrand());
    // dispatch(filterDesignTemplate());
  }, [dispatch]);

  return (
    <>
      <ErrorPopup open={apiError} onClick={() => setApiError(false)} />
      <BrandWrapper>
        <BrandSection title={BRAND_TITLE.brand} isHead />
        <BrandSection title={BRAND_TITLE.brandName}>
          {informationCompany && (
            <BrandNameSection
              dispatch={dispatch}
              informationCompany={informationCompany}
            />
          )}
        </BrandSection>
        <BrandSection title={BRAND_TITLE.logo}>
          <WrapLogos>
            {informationLogo && (
              <LogoSection
                dispatch={dispatch}
                informationLogo={informationLogo}
                isLoading={isFileLoading}
                typeFileUploading={typeFileUploading}
              />
            )}
          </WrapLogos>
        </BrandSection>
        <BrandSection title={BRAND_TITLE.color} id={NAME_SECTION.colors}>
          <WrapColors>
            {informationCompany && (
              <>
                {isMobile ? (
                  <ColorSectionMobile
                    dispatch={dispatch}
                    informationCompany={informationCompany}
                    isMobile={isMobile}
                  />
                ) : (
                  <ColorSection
                    dispatch={dispatch}
                    informationCompany={informationCompany}
                  />
                )}
              </>
            )}
          </WrapColors>
        </BrandSection>
        <BrandSection title={BRAND_TITLE.font} id={NAME_SECTION.fonts}>
          <WrapFonts>
            {informationCompany && (
              <FontSection
                dispatch={dispatch}
                informationCompany={informationCompany}
              />
            )}
          </WrapFonts>
        </BrandSection>
        <Accordion className={classes.accordion}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className={classes.expandMoreIcon} />}
            className={classes.accordionSummary}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>{BRAND_TITLE.information}</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            <BrandSection isAccordion>
              {informationCompany && (
                <InfoSection
                  dispatch={dispatch}
                  informationCompany={informationCompany}
                />
              )}
            </BrandSection>
          </AccordionDetails>
        </Accordion>
        <BrandSection title={BRAND_TITLE.library}>
          {informationCompany && (
            <LibrarySection
              dispatch={dispatch}
              informationImage={informationImage}
              informationVideo={informationVideo}
              informationAudio={informationAudio}
              isLoading={isFileLoading}
              typeFileUploading={typeFileUploading}
            />
          )}
        </BrandSection>
        {/* {!!informationEsign.length && (
          <BrandSection title={BRAND_TITLE.esign}>
            {informationCompany && (
              <EsignSection
                dispatch={dispatch}
                informationEsign={informationEsign}
              />
            )}
          </BrandSection>
        )} */}
      </BrandWrapper>
    </>
  );
};

const BrandWrapper = styled.div`
  @media only screen and (max-width: 960px) {
    padding: 0 8px;
  }
`;
const WrapLogos = styled.div`
  display: block;
  max-width: 461px;
  height: 100%;
  @media only screen and (max-width: 960px) {
    max-width: none;
  }
`;
const WrapColors = styled.div`
  display: block;
  max-width: 461px;
  height: 100%;
  @media only screen and (max-width: 960px) {
    max-width: none;
  }
`;
const WrapFonts = styled.div`
  display: block;
  max-width: 461px;
  height: 100%;
  @media only screen and (max-width: 960px) {
    max-width: none;
  }
`;

export default Brand;
