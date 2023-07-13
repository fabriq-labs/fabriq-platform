import React from "react";
import { FunnelChart, Funnel, Tooltip } from "recharts";

const FunnelRechart = ({ data = [] }) => {
  return (
    <FunnelChart width={400} height={200}>
      <Funnel
        dataKey="value"
        data={data}
        isAnimationActive={false}
        label={{ position: "center", fontSize: 14 }}
        neckWidth={50}
        neckHeight={20}
        fill="#cce4f5"
      />
      <Tooltip />
    </FunnelChart>
  );
};

export default FunnelRechart;
