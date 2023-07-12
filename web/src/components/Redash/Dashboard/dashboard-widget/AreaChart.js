// Area Chart
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { COLORS } from "./colors";
import CustomToolTipComponent from "./CustomTooltip";
import { handleCLick } from "./navigate";

const Chart = (props) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart
        width={500}
        height={400}
        data={props.data}
        margin={{
          top: 10,
          right: 30,
          left: 30,
          bottom: 0
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
        {props.list.map((eachitem, index) => (
          <Area
            type="monotone"
            dataKey={eachitem}
            stroke={COLORS[COLORS.length - index]}
            fill={COLORS[COLORS.length - index]}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
