import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Tooltip } from "recharts";
import { handleCLick } from "./navigate";
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

const CustomToolTipComponent = ({ payload, YList, dataRows, Xvalue }) => {
  let Yname = payload && payload[0] && payload[0].name;
  let node = dataRows.find((a) => a[Xvalue] === Yname);
  if (payload && payload.length) {
    return (
      <Wrapper>
        {YList.length > 0 &&
          YList.map((item) => {
            if (item === Xvalue) {
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
            if (item !== Xvalue) {
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

const renderActiveShape = (eachitem, customTooltip, props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {eachitem}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      {!customTooltip && (
        <>
          <path
            d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
            stroke={fill}
            fill="none"
          />
          <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /> */}
          <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            textAnchor={textAnchor}
            fill="#333"
          >{`${value}`}</text>
          <text
            x={ex + (cos >= 0 ? 1 : -1) * 12}
            y={ey}
            dy={18}
            textAnchor={textAnchor}
            fill="#999"
          >
            {payload.name}
            {` ( ${(percent * 100).toFixed(2)}%)`}
          </text>
        </>
      )}
    </g>
  );
};

export default class Example extends PureComponent {
  state = {
    activeIndex: 0,
    data: []
  };

  componentDidMount() {
    const { filteredData, eachitem, xAxisValue } = this.props;
    const data =
      filteredData &&
      filteredData.rows.length &&
      filteredData.rows.map((row) => {
        return {
          name: row[xAxisValue],
          [xAxisValue]: row[xAxisValue],
          value: parseInt(row[eachitem])
        };
      });

    this.setState({ data });
  }

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index
    });
  };

  render() {
    const { eachitem, name, dataRows, tooltipList, xAxisValue, customTooltip } =
      this.props;
    return (
      <ResponsiveContainer width="100%" height={250}>
        <PieChart width={400} height={400}>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={(props) =>
              renderActiveShape(eachitem, customTooltip, props)
            }
            data={this.state.data}
            cx="50%"
            cy="50%"
            onClick={(data) => {
              handleCLick(data, this.props.link);
            }}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={this.onPieEnter}
          />
          {customTooltip && (
            <Tooltip
              content={
                <CustomToolTipComponent
                  data={name}
                  dataRows={dataRows}
                  YList={tooltipList}
                  Xvalue={xAxisValue}
                />
              }
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
