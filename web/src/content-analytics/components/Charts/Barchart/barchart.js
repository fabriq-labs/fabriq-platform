// BarChart
import React from "react";
import ReactApexChart from "react-apexcharts";
import { formatNumber } from "../../../../utils/helper";

const BarChart = ({
  labels,
  series,
  colors,
  width,
  name,
  tickAmount,
  logarithmic = false,
  tooltipLabels = null
}) => {
  const adjustedSeries = logarithmic
    ? series.map((value) => (value < 1 ? 1e-5 : value))
    : series;

  const tooltipFormatter = function (value, { _seriesIndex, dataPointIndex }) {
    if (tooltipLabels?.length > 0) {
      return tooltipLabels?.[dataPointIndex];
    } else {
      // If no custom tooltip label is available, format the value using formatNumber
      return value;
    }
  };

  return (
    <ReactApexChart
      options={{
        xaxis: {
          categories: labels,
          tickAmount: tickAmount === true ? labels?.length / 2 : labels?.length
        },
        yaxis: {
          logarithmic: logarithmic,
          type: logarithmic ? "logarithmic" : "numeric",
          labels: {
            formatter: function (value) {
              const intValue = parseInt(value, 10);
              return intValue ? formatNumber(intValue) : 0;
            }
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
            show: true,
            formatter: tooltipFormatter
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
          data: adjustedSeries
        }
      ]}
      type="bar"
      width="100%"
      height={250}
    />
  );
};

export default BarChart;
