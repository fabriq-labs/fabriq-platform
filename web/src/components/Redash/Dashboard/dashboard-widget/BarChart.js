// Bar Chart Component
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { COLORS } from "./colors";
import CustomToolTipComponent from "./CustomTooltip";
import { handleCLick } from "./navigate";

const BarChartComponent = (props) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        width={500}
        height={300}
        data={props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
        onClick={(data) => {
          handleCLick(data, props.link);
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={props.xAxisValue} />
        <YAxis />
        {props.customTooltip ? (
          <Tooltip
            content={
              <CustomToolTipComponent
                data={props.name}
                dataRows={props.dataRows}
                YList={props.tooltipList}
                Xvalue={props.xAxisValue}
                Yvalue={props.list[0]}
              />
            }
          />
        ) : (
          <Tooltip />
        )}
        <Legend />
        {props.list.map((item, index) => (
          <Bar dataKey={item} fill={COLORS[index]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
