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

let label = [
  "12",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24"
];
const AreaChart = ({ series }) => {
  const options = {
    xaxis: {
      categories: label
    },
    yaxis: {
      labels: {
        formatter: (value) => convertor(value)
      }
    },
    chart: {
      type: "area",

      foreColor: "#ccc",
      toolbar: {
        autoSelected: "pan",
        show: false
      }
    },
    stroke: {
      width: 3
    },
    grid: {
      borderColor: "#555",
      clipMarkers: false,
      yaxis: {
        lines: {
          show: false
        },
        label: {
          show: true
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    legend: {
      show: true,
      showForSingleSeries: true,
    },  
    markers: {
      size: 5,
      // colors: ["#fff"],
      // strokeColor: "#afbf84",
      strokeWidth: 3
    }
  };
  return (
    <div
      className="area-chart"
      data-testid="bar-chart"
      style={{ width: "97%" }}
    >
      <ReactApexChart
        options={options}
        series={[
          {
            name: "Page Views",
            data: series
          }
        ]}
        type="area"
        width="100%"
        height={250}
      />
    </div>
  );
};

export default AreaChart;
