import React from "react";
import ReactApexChart from "react-apexcharts";
import { isEqual } from "lodash";

const StackAreaChart = ({ series, labels }) => {
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


  return (
    <ReactApexChart
      options={{
        xaxis: {
          categories: labels // Use the stringLabels array here
        },
        legend: {
          formatter: function (val, opts) {
            return capitalizeFirstLetter(val);
          }
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              const intValue = parseInt(value, 10);
              return intValue;
            }
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
        }
      }}
      series={series} // Use the updatedSeries with missing columns filled with zeros
      type="area"
      height={200}
    />
  );
};

const arePropsEqual = (prevProps, nextProps) => {
  // Deep comparison of series and labels props
  return (
    isEqual(prevProps.series, nextProps.series) &&
    isEqual(prevProps.labels, nextProps.labels)
  );
};

export default React.memo(StackAreaChart, arePropsEqual);
