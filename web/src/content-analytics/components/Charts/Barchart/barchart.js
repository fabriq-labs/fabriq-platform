// BarChart
import React from "react";
import ReactApexChart from "react-apexcharts";

const BarChart = ({ labels, series, colors, width, name, tickAmount }) => {
  return (
    <ReactApexChart
      options={{
        xaxis: {
          categories: labels,
          tickAmount: tickAmount === true ? labels?.length / 2 : labels?.length
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              const intValue = parseInt(value, 10);
              return intValue;
            },
          },
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
          height: 200,
          toolbar: {
            show: false
          }
        },
        legend: {
          show: true,
          showForSingleSeries: true
        },
        plotOptions: {
          bar: {
            barHeight: "50%",
            borderRadius: 10,
            columnWidth: width || "20px",
            dataLabels: {
              position: "bottom"
            }
          }
        }
      }}
      series={[
        {
          name: name || "Page Views",
          data: series
        }
      ]}
      type="bar"
      width="100%"
      height={250}
    />
  );
};

export default BarChart;
