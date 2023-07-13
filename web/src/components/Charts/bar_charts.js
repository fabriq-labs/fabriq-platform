import React from "react";
import ReactApexChart from "react-apexcharts";

const convertor = (value) => {
  return Math.abs(Number(value)) >= 1.0e6
    ? Math.abs(Number(value)) / 1.0e6 + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(value)) >= 1.0e3
    ? Math.abs(Number(value)) / 1.0e3 + "K"
    : Math.abs(Number(value))
    ? Math.abs(Number(value))
    : `${value}`;
};
const BarChart = ({ series }) => {
  return (
    <ReactApexChart
      options={{
        xaxis: {
          labels: {
            show: false
          }
        },
        yaxis: {
          labels: {
            formatter: (value) => convertor(value)
          }
        },
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
          }
        },
        dataLabels: {
          enabled: false,
          style: {
            fontSize: "10px",
            colors: ["#414141"]
          }
        },
        legend: {
          show: true,
          showForSingleSeries: true,
        },
        chart: {
          type: "bar",
          height: 230,
          toolbar: {
            autoSelected: "pan",
            show: false
          }
        },
        stroke: {
          width: 3
        }
      }}
      series={[
        {
          name: "Page Views",
          data: series
        }
      ]}
      type="bar"
      height={250}
    />
  );
};

export default BarChart;
