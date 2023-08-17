import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { formatNumber } from "../../../../utils/helper";

const ChartComponent = ({ labels, series, colors, height }) => {
  const [seriesData, setSeriesData] = useState([]);
  const [scatterYAxisRange, setscatterYAxisRange] = useState(null);
  const [lineYaxisRange, setlineYaxisRange] = useState(null);
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

    if (!Array.isArray(series)) return;

    // let  tempYaxis =[]
    const tempYaxis = series
      .filter((data) => data.name === "New Post")
      .map((data) => {
        const scatterYValues = data.data.map(
          (point) => point !== null && point
        );
        const minScatterY = Math.min(...scatterYValues);
        const maxScatterY = Math.max(...scatterYValues);

        return [minScatterY, maxScatterY];
      });

    function setYAxisMinMax(series) {
      let minYValue = Infinity;
      let maxYValue = -Infinity;

      series.forEach((data) => {
        if (data.name === "Current" || data.name === "Average") {
          const yValues = data.data.filter((point) => point !== null);
          const minScatterY = Math.min(...yValues);
          const maxScatterY = Math.max(...yValues);

          minYValue = Math.min(minYValue, minScatterY);
          maxYValue = Math.max(maxYValue, maxScatterY);
        }
      });

      return [minYValue, maxYValue];
    }

    setSeriesData(updatedSeriesData);
    setscatterYAxisRange(tempYaxis);
    setlineYaxisRange(setYAxisMinMax(series));

  }, [series]);


  // Create a new ApexCharts instance
  const chartOptions = {
    chart: {
      height: 350,
      type: "line",
      toolbar: {
        show: false
      }
    },
    stroke: {
      width: [5, 5, 0],
      curve: "straight"
    },
    colors: colors,
    series: seriesData,
    xaxis: {
      categories: labels,
      tickAmount: labels?.length / 2,
      labels: {
        rotate: -0
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
    dataLabels: {
      enabled: false
    },
    yaxis: [
      {
        id: "line-y-axis",
        labels: {
          formatter: function (value) {
            return formatNumber(value);
          }
        },
        min: lineYaxisRange && lineYaxisRange[0][0],
        max: lineYaxisRange && lineYaxisRange[0][1],
        show: true
      },
      {
        id: "line-y-axis",
        labels: {
          formatter: function (value) {
            return formatNumber(value);
          }
        },
        min: lineYaxisRange && lineYaxisRange[0][0],
        max: lineYaxisRange && lineYaxisRange[0][1],
        show: false
      },

      {
        id: "scatter-y-axis",
        opposite: true,
        min: scatterYAxisRange && scatterYAxisRange[0][0],
        max: scatterYAxisRange && scatterYAxisRange[0][1],
        show: false
      }
    ],
    markers: {
      size: 5,
      colors: ["#A3E0FF", "#c4e0d7", "#e89de1"],
      strokeColors: "#fff",
      strokeWidth: 1,
      shape: "circle",
      hover: {
        size: 6
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
    }
  };

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartOptions.series}
      type="line"
      width="100%"
      height={height || 200}
    />
  );
};

export default ChartComponent;
