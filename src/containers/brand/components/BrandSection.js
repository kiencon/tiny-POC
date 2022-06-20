import React from 'react';
import styled from 'styled-components';

const BrandSection = ({
  isHead, title, children, isAccordion, id,
}) => (
  <section id={id} className={id}>
    <Wrapper style={isAccordion ? { marginBottom: 0 } : {}}>
      {isHead ? (
        <Section className="heading">
          <h1>{title}</h1>
        </Section>
      ) : (
        <Section>
          {!isAccordion && (
            <div className="title">{title}</div>
          )}
          {children}
        </Section>
      )}
    </Wrapper>
  </section>
);

const Wrapper = styled.div`
  display: inline-flex;
  margin-bottom: 27px;
  width: 100%;
  padding-top: 5px;
  .heading {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    h1 {
      height: 32px;
      font-family: Roboto;
      font-size: 26px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.23;
      letter-spacing: normal;
      color: #222b45;
    }
  }
  .title {
    margin-bottom: 17px;
    height: 32px;
    font-family: Roboto;
    font-size: 22px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.45;
    letter-spacing: normal;
    color: #222b45;
  }
`;
const Section = styled.div`
  width: 100%;
  display: flow-root;
  position: relative;
  @media only screen and (max-width: 960px) {
    position: unset;
  }
`;
export default BrandSection;
