import { Button, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { INPUT_INFOMATION, NAME_SECTION, ALLOW_INPUT_PHONE } from '../../../config/constant';
import { emailValid } from '../../../helpers/validation';
import { updateInformationCompany } from '../state/action';
import { toastrSuccess } from '../../../components/common/toastCustom';

const useStyles = makeStyles(() => ({
  hasError: {
    borderRadius: '4px',
    border: 'solid 1px #c52728',
    '&:focus': {
      borderRadius: '4px',
      border: 'solid 1px #c52728',
    },
  },
  informError: {
    color: '#c52728',
    height: '20px',
    margin: '8px 0 0 0',
    fontFamily: 'Roboto',
    fontSize: '15px',
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: '1.33',
    letterSpacing: 'normal',
  },
  button: {
    width: '122px',
    height: '40px',
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 'bold',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 1.14,
    letterSpacing: 'normal',
    textTransform: 'capitalize',
  },
  buttonClear: {
    color: '#222b45',
    borderRadius: '4px',
    border: 'solid 1px #222b45',
    marginRight: '8px',
    '&:hover': {
      borderRadius: '4px',
      color: '#ffffff',
      backgroundColor: '#222b45',
    },
  },
  buttonSave: {
    boxShadow: 'none',
    borderRadius: '4px',
    backgroundColor: '#2c83eb',
    '&:hover': {
      borderRadius: '4px',
      backgroundColor: '#1962cd',
      boxShadow: 'none',
    },
  },
  hasEdit: {
    display: 'none',
    pointerEvents: 'none',
  },
  hiddenInput: {
    display: 'none',
  },
}));

const InfoSection = React.memo(({ informationCompany, dispatch }) => {
  const classes = useStyles();
  const informationInitial = {
    website: '',
    phoneNumber: '',
    emails: '',
    address: '',
  };
  const [companyInformation, setCompanyInformation] = useState(informationInitial);
  const [isEdit, setEdit] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const inputNameConditionals = ['website', 'emails'];

  useEffect(() => {
    const dataFound = informationCompany.find(section => section.name.toLowerCase() === NAME_SECTION.information);
    if (dataFound) {
      setCompanyInformation(JSON.parse(dataFound.value));
    }
  }, [informationCompany]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === INPUT_INFOMATION[2].name) {
      const regex = new RegExp(ALLOW_INPUT_PHONE.numberReg);
      const charKeyDown = value.length ? value[value.length - 1] : '';
      if (regex.test(charKeyDown) || ALLOW_INPUT_PHONE.allowChars.includes(charKeyDown)) {
        setCompanyInformation({
          ...companyInformation,
          [name]: value,
        });
      } else {
        setCompanyInformation({
          ...companyInformation,
          [name]: value.slice(0, value.length - 1),
        });
      }
    } else {
      setCompanyInformation({
        ...companyInformation,
        [name]: inputNameConditionals.includes(name) ? value : encodeURIComponent(value),
      });
    }
    setEdit(true);
  };
  const handleEdit = () => {
    const dataFound = informationCompany.find(section => section.name.toLowerCase() === NAME_SECTION.information);
    if (dataFound) {
      setCompanyInformation(JSON.parse(dataFound.value));
    }
    setEdit(false);
  };
  const handleSave = () => {
    dispatch(updateInformationCompany(companyInformation));
    setEdit(false);
    toastrSuccess('Save successfully');
  };

  const checkEmailInvalid = (input, value) => value && input.regex && !emailValid(input, value);
  const handleValidEmail = (input, value) => {
    if (checkEmailInvalid(input, value)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const inputField = (index, input, value) => (
    <WrapInput key={input.name} className={`${index === 0 && classes.hiddenInput}`}>
      <Title>{input.title}</Title>
      <WrapField>
        <InputField
          value={(inputNameConditionals.includes(input.name) ? value : value && decodeURIComponent(value)) || ''}
          name={input.name}
          type={input.type}
          className={`${(isValid && input.name === INPUT_INFOMATION[3].name) && classes.hasError}`}
          onChange={e => handleChange(e)}
          onBlur={() => input.name === INPUT_INFOMATION[3].name && handleValidEmail(input, value)}
        />
      </WrapField>
      {isValid && input.name === INPUT_INFOMATION[3].name && (
        <p className={classes.informError}>{input.textValid}</p>
      )}
    </WrapInput>
  );

  return (
    <Wrap>
      {INPUT_INFOMATION.map((inputInfo, index) => inputField(index, inputInfo, companyInformation[inputInfo.name]))}
      <WrapButton className={!isEdit && classes.hasEdit}>
        <Button
          variant="outlined"
          className={`${classes.button} ${classes.buttonClear}`}
          onClick={handleEdit}
          disableElevation
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={`${classes.button} ${classes.buttonSave}`}
          onClick={handleSave}
          disableElevation
        >
          Save Changes
        </Button>
      </WrapButton>
    </Wrap>
  );
});

const WrapButton = styled.div`
  position: fixed;
  bottom: 0;
  width: 85%;
  height: 80px;
  background-color: #ffffff;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e6e6e6;
  @media only screen and (max-width: 767px) {
    width: 100vw;
    padding: 0 16px;
    left: 0;
    justify-content: space-around;
    button {
      width: 45%;
      margin: 0;
    }
  }
`;
const InputField = styled.input`
  width: 100%;
  height: 40px;
  margin: 8px 0 0;
  padding: 10px 16px;
  border-radius: 4px;
  border: solid 1px #c5cee0;
  font-family: Roboto;
  font-size: 15px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  color: #222b45;
  box-shadow: none;
  ::placeholder {
    color: #8f9bb3;
  };
  :hover {
    border-radius: 4px;
    border: solid 1px #2c83eb;
    outline: none;
  }
  :focus {
    border-radius: 4px;
    border: solid 1px #2c83eb;
    outline: none;
  }
  :matches(
    [type="email"],
    [type="number"],
    [type="password"],
    [type="search"],
    [type="tel"],
    [type="text"],
    [type="url"]
  ) {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
`;
const Wrap = styled.div`
  width: 461px;
  @media only screen and (max-width: 960px) {
    width: 100%;
  }
`;
const WrapInput = styled.div`
  width: 100%;
`;
const WrapField = styled.div`
  display: flex;
  justify-content: space-between;
  input[type=number] {
    -moz-appearance:textfield;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
const Title = styled.p`
  height: 24px;
  margin: 16px 0 0 0;
  font-family: Roboto;
  font-size: 15px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  color: #8f9bb3;
`;

export default InfoSection;
