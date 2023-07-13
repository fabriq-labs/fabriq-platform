import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { formatNumber } from "../../../utils/helper";
import * as moment from "moment";

const generateXLabels = (timestamps, selectedRange) => {
  const startDate = new Date(selectedRange.startRange);
  const endDate = new Date(selectedRange.endRange);
  const filteredTimestamps = timestamps.filter((timestamp) => {
    const date = new Date(timestamp);
    return date >= startDate && date <= endDate;
  });
  const xLabels = filteredTimestamps.map((timestamp) => {
    return new Date(timestamp).toISOString().slice(0, 10);
  });
  return xLabels;
};

const generateChartData = (data, selectedRange) => {
  const startDate = new Date(selectedRange.startRange);
  const endDate = new Date(selectedRange.endRange);
  const chartData = [];

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    const matchingData = data.find((item) => {
      const itemDate = new Date(item[0]).toISOString().slice(0, 10);
      return itemDate === dateStr;
    });

    if (matchingData) {
      chartData.push(matchingData);
    } else {
      chartData.push([new Date(dateStr).getTime(), 0]); // Add default value for missing dates
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return chartData;
};

const BrushBarChart = (props) => {
  const { series, selectedRange, handleChange } = props;

  // Extract the timestamps from the series data
  const timestamps = series[0]?.data.map((point) => point[0]);

  // Generate x-axis labels based on the timestamps and selected range
  const xLabels = generateXLabels(timestamps, selectedRange);
  const numTicks = Math.max(15, xLabels.length);

  const seriesData = generateChartData(series[0].data, selectedRange);

  const [options, setOptions] = useState({
    chart: {
      id: "chart2",
      type: "line",
      height: 230,
      toolbar: {
        autoSelected: "pan",
        show: false
      },
      events: {
        selection: function (chartContext, { xaxis, yaxis }) {
          // use xaxis to get the selection range
          // do something with the selection range
        },
        mounted: function (chart) {
          // var commitsEl = document.querySelector('.cmeta span.commits');
          var commits = chart.getSeriesTotalXRange(
            chart.w.globals.minX,
            chart.w.globals.maxX
          );

          // commitsEl.innerHTML = commits
        },
        updated: function (chart, xaxis) {
          if (chart?.toolbar) {
            const timestamp = chart?.toolbar.maxX;
            const timpeStampMin = chart?.toolbar.minX;
            const formattedDateMax = moment(timestamp).format("YYYY-MM-DD");
            const formattedDateMin = moment(timpeStampMin).format("YYYY-MM-DD");
            handleChange(formattedDateMin, formattedDateMax);
          }
        }
      }
    },
    xaxis: {
      type: "datetime",
      categories: xLabels,
      tickAmount: numTicks,
      labels: {
        rotate: -45,
        formatter: function (value) {
          const date = new Date(value);
          const month = date.toLocaleString("default", { month: "short" });
          const day = date.getDate();
          return `${month} ${day}`;
        }
      },
      min: new Date(timestamps[0]).getTime(), // Set the minimum value of x-axis to the first timestamp
      max: new Date(selectedRange.endRange).getTime() // Set the maximum value of x-axis to the endRange timestamp
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
    colors: ["#11c5a6"],
    stroke: {
      width: 3
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 1
    },
    markers: {
      size: 0
    }
  });
  const [optionsLine, setOptionLine] = useState({
    chart: {
      id: "chart1",
      height: 130,
      type: "bar",
      brush: {
        target: "chart2",
        enabled: true
      },
      events: {
        updated: function (chart, { config, xaxis }) {
          if (config && config.selection) {
            const { xaxis: selectionXAxis } = config.selection;
            if (selectionXAxis) {
              // console.log(
              //   "do something with selection range",
              //   selectionXAxis.min,
              //   selectionXAxis.max
              // );
              // do something with selection range
            }
          }
        }
      },
      selection: {
        enabled: true,
        xaxis: {
          min: new Date("2023-05-30").getTime(),
          max: new Date("2023-06-21").getTime()
        }
      }
    },
    colors: ["#008FFB"],
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.91,
        opacityTo: 0.1
      }
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false
      }
    },
    yaxis: {
      tickAmount: 2,
      labels: {
        formatter: function (value) {
          // format the value here
          return formatNumber(value);
        }
      }
    }
  });

  const [seriesValue, setSeriesValue] = useState([]);
  const [seriesLine, setSeriesLine] = useState([]);

  useEffect(() => {
    const updatedSeries = [
      {
        name: series[0].name,
        data: seriesData
      }
    ];

    const processedSeries = updatedSeries.map((data) => {
      const filteredData = data.data.map(([x, y]) => [x, y !== 0 ? y : null]);
      return { ...data, data: filteredData };
    });
    setSeriesValue(processedSeries || []);
    setSeriesLine(updatedSeries || []);
    const yValues = processedSeries?.[0]?.data.map((entry) => entry[1]);
    updateSelection(selectedRange, yValues);
  }, [series, selectedRange]);

  const updateSelection = (selectedRange, yValues) => {
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    setOptionLine((prevOptions) => ({
      ...prevOptions,
      chart: {
        ...prevOptions.chart,
        selection: {
          ...prevOptions.chart.selection,
          xaxis: {
            min: new Date(selectedRange.startRange).getTime(),
            max: new Date(selectedRange.endRange).getTime()
          }
        }
      },
      yaxis: {
        tickAmount: 2,
        labels: {
          formatter: function (value) {
            return formatNumber(value);
          }
        },
        min: minY,
        max: maxY
      }
    }));

    setOptions((prevOptions) => ({
      ...prevOptions,
      yaxis: {
        tickAmount: 2,
        labels: {
          formatter: function (value) {
            return formatNumber(value);
          }
        },
        min: minY,
        max: maxY
      }
    }));
  };

  return (
    <div id="wrapper">
      <div id="chart-line2">
        <ReactApexChart
          options={options}
          series={seriesValue}
          type="bar"
          height={230}
        />
      </div>
      <div id="chart-line">
        <ReactApexChart
          options={optionsLine}
          series={seriesLine}
          type="area"
          height={130}
        />
      </div>
    </div>
  );
};

export default BrushBarChart;
