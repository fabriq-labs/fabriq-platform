import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";
import { COLORS } from "./colors";
import CustomToolTipComponent from "./CustomTooltip";
import { handleCLick } from "./navigate";

const Chart = (props) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
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
        {props.list.map((eachitem, index) => (
          <Line
            type="monotone"
            dataKey={eachitem}
            stroke={COLORS[index]}
            strokeWidth={4}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
