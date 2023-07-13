// Button Component

import React, { useState } from "react";
import { Radio } from "antd";

const ButtonComp = ({ labels, onChange, defaultActive }) => {
  const [val, setVal] = useState(defaultActive);

  const handleChange = (e) => {
    setVal(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <Radio.Group value={val} onChange={handleChange}>
      {labels?.map((lab, i) => {
        return (
          <Radio.Button
            style={{
              color: val === lab.name ? "#fff" : "#b6b5b6",
              fontWeight: 500,
              border: val === lab.name ? "2px solid #b6b5b6" : "",
              backgroundColor: val === lab.name ? "#379de3" : "#fff"
            }}
            value={lab.name}
            key={i}
          >
            {lab?.name}
          </Radio.Button>
        );
      })}
    </Radio.Group>
  );
};

export default ButtonComp;
