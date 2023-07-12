// Radio Component
import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  [type="radio"]:checked,
  [type="radio"]:not(:checked) {
    position: absolute;
    left: -9999px;
  }
  [type="radio"]:checked + label,
  [type="radio"]:not(:checked) + label {
    position: relative;
    padding-left: 28px;
    cursor: pointer;
    line-height: 20px;
    font-size: 13px;
    display: inline-block;
    color: #000;
    font-weight: 700;
  }
  [type="radio"]:checked + label:before,
  [type="radio"]:not(:checked) + label:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 20px;
    height: 20px;
    border: 1px solid #006fcf;
    border-radius: 100%;
    background: #fff;
  }
  [type="radio"]:checked + label:after,
  [type="radio"]:not(:checked) + label:after {
    content: "";
    width: 10px;
    height: 10px;
    background: #006fcf;
    position: absolute;
    top: 5px;
    left: 5px;
    border-radius: 100%;
    -webkit-transition: all 0.2s ease;
    transition: all 0.2s ease;
  }
  [type="radio"]:not(:checked) + label:after {
    opacity: 0;
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  [type="radio"]:checked + label:after {
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  margin-bottom: 0px;
  margin-right: 10px;
`;

// Main Component
const Radio = (props) => {
  const { name, value, label, selected, handleChange, disabled } = props;
  return (
    <Wrapper>
      <input
        type="radio"
        id={value}
        name={name}
        checked={selected === value}
        value={value}
        disabled={disabled}
        onChange={(e) => handleChange(name, e.target.value)}
      />
      <label htmlFor={value}>{label}</label>
    </Wrapper>
  );
};

export default Radio;
