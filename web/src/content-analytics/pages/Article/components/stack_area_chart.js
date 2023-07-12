import React from "react";
import ReactApexChart from "react-apexcharts";

const StackAreaChart = ({ series, labels }) => {
  return (
    <ReactApexChart
      options={{
        xaxis: {
          categories: labels
        },
        grid: {
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        tooltip: {
          x: {
            show: true
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth",
          width: [0]
        },
        chart: {
          type: "area",
          height: 160,
          toolbar: {
            show: false
          }
        },
      }}
      series={series}
      type="area"
      height={160}
    />
  );
};

export default StackAreaChart;
