// Linechart
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { formatNumber } from "../../../../utils/helper";

const LineChart = ({ labels, series, colors, height }) => {
  const [seriesData, setSeriesData] = useState([]);
  useEffect(() => {
    setSeriesData(series);
  }, [series]);

  return (
    <ReactApexChart
      options={{
        xaxis: {
          categories: labels,
          tickAmount: labels?.length / 2,
          labels: {
            rotate: -0
          }
        },
        colors: colors,
        grid: {
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: false
            }
          }
        },
        tooltip: {
          x: {
            show: true
          },
          y: [
            {
              formatter: function (val) {
                return formatNumber(val);
              }
            },
            {
              formatter: function (val, data) {
                return formatNumber(val);
              }
            }
          ]
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return formatNumber(value);
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          }
        },
        legend: {
          show: true,
          showForSingleSeries: true
        },
        stroke: {
          curve: "straight"
        }
      }}
      series={seriesData ? seriesData : []}
      type="line"
      width="100%"
      height={height ? height : 200}
    />
  );
};

export default LineChart;
