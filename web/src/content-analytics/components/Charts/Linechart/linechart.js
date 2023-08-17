// Linechart
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { formatNumber } from "../../../../utils/helper";

const LineChart = ({ labels, series, colors, height }) => {
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    const currentDateTime = new Date();
    const currentHour = currentDateTime.getUTCHours();

    // Extract data up to the current hour for the "Current" series
    const currentSeries = series?.find((item) => item.name === "Current");
    const currentData = currentSeries?.data.slice(0, currentHour);

    // Create a new series with the updated data for the "Current" series
    const updatedSeriesData = series?.map((data) => {
      if (data.name === "Current") {
        return {
          ...data,
          data: currentData
        };
      }
      return data;
    });

    
    setSeriesData(updatedSeriesData);
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
      series={seriesData || []}
      type="line"
      width="100%"
      height={height || 200}
    />
  );
};

export default LineChart;
