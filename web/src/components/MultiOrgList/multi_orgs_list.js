// Multi Org List Component
import React from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";
import styled from "styled-components";

const WrapperForm = styled.div``;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 10%;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const ContentImage = styled.div`
  width: 30%;
`;

const ContentLogin = styled.div`
  width: 30%;
  margin-left: 5%;

  @media (max-width: 992px) {
    width: 100%;
    margin-left: 1%;
  }
`;

const Heading = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 2px;
  line-height: 34px;
  margin: 0 0 6% 0;
`;

const ImageLogin = styled.img`
  max-width: 100%;
  height: auto;
`;

const SelectOrg = styled.div`
  width: 95%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 0 2%;
`;

const CardOrg = styled.div`
  width: 28%;
  display: flex;
  height: 100%;
  min-height: 100px;
  justify-content: center;
  align-items: center;
  margin: 10px;
  border-radius: 5px;
  cursor: pointer;
  border: 2px solid #e8e8e8;
  box-shadow: rgba(40, 60, 75, 0.05) 13px 0px 20px;
  &:hover {
    box-shadow: rgba(102, 136, 153, 0.15) 0px 4px 9px -3px;
    background-color: #dff2fa;
  }

  .hed-txt {
    font-size: 15px;
    font-weight: 600;

    @media (max-width: 992px) {
      font-size: 12px;
    }
  }
`;

// Main Component
const MultiOrgList = (props) => {
  const { onNext, orgList } = props;

  const saveAndContinue = (data) => {
    if (data && onNext) {
      onNext(data);
    }
  };

  return (
    <WrapperForm>
      <Content>
        <ContentImage>
          <ImageLogin src="/images/login.svg" alt="signup" />
        </ContentImage>
        <ContentLogin>
          <Heading>Select your organization</Heading>
          <SelectOrg>
            {orgList &&
              orgList.map((list, index) => (
                <CardOrg
                  key={`${list.fabriq_org_id}-${index}`}
                  onClick={() => saveAndContinue(list)}
                >
                  <div className="hed-txt">{list.fabriq_org_name}</div>
                </CardOrg>
              ))}
          </SelectOrg>
        </ContentLogin>
      </Content>
    </WrapperForm>
  );
};

MultiOrgList.propTypes = {
  onNext: PropTypes.func
};

MultiOrgList.defaultProps = {
  onNext: null
};

export default React.memo(MultiOrgList, isEqual);
