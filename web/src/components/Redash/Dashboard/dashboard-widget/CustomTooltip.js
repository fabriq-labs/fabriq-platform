// Custom Tooltip Component
import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  border: 1 px solid #000;
  color: #323232;

  .itm-key {
    color: #3182bd;
  }

  .ttp-das {
    padding: 0 20px 0 20px;
    margin: 3px 0 3px 0;
    height: 1px;
    background-color: #dcdcdc;
  }

  .top-hed {
    color: #708090;
    font-weight: 700;
  }
`;

const CustomToolTipComponent = ({
  payload,
  label,
  YList,
  dataRows,
  Xvalue,
  Yvalue
}) => {
  let node = dataRows.find((a) => a[Xvalue] === label);
  if (payload && payload.length) {
    return (
      <Wrapper>
        {YList.length > 0 &&
          YList.map((item) => {
            if (item === Xvalue || item === Yvalue) {
              return (
                <p className="desc">
                  <span className="itm-key">{`${item}: `}</span>
                  <span>{`${node[item]}`}</span>
                </p>
              );
            }
          })}
        <div className="ttp-das"></div>
        <div className="top-hed">Details</div>
        {YList.length > 0 &&
          YList.map((item) => {
            if (item !== Xvalue && item !== Yvalue) {
              return (
                <p className="desc">
                  <span className="itm-key">{`${item}: `}</span>
                  <span>{`${node[item]}`}</span>
                </p>
              );
            }
          })}
      </Wrapper>
    );
  }
  return null;
};

export default CustomToolTipComponent;
