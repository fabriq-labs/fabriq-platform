// Scatter Chart Component
import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { COLORS } from "./colors";
import { handleCLick } from "./navigate";

const ScatterChartComponent = (props) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <ScatterChart
        width={400}
        height={400}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }}
      >
        <CartesianGrid />
        <XAxis dataKey={props.xAxisValue} />
        {props.list.map((item, index) => (
          <YAxis yAxisId={index} dataKey={item} />
        ))}
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />
        {props.list.map((item, index) => (
          <Scatter
            yAxisId={index}
            data={props.data}
            fill={COLORS[index]}
            name={item}
            onClick={(data) => {
              handleCLick(data, props.link);
            }}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterChartComponent;
