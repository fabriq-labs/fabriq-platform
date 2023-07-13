import React from "react";
import ReactApexChart from "react-apexcharts";

const BarChart = ({ labels, series, colors }) => {
  return (
    <ReactApexChart
      options={{
        xaxis: {
          categories: labels
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
          }
        },
        dataLabels: {
          enabled: false
        },
        chart: {
          type: "bar",
          height: 150,
          toolbar: {
            show: false
          }
        },
        legend: {
          show: true,
          showForSingleSeries: true,
        },
        plotOptions: {
          bar: {
            barHeight: "50%",
            borderRadius: 10,
            columnWidth: "30px",
            dataLabels: {
              position: "bottom",
            },
          },
        },
      }}
      series={[
        {
          data: series
        }
      ]}
      type="bar"
      height={150}
    />
  );
};

export default BarChart;
