import React from "react";
import ReactApexChart from "react-apexcharts";

const Charts = ({ labels, series }) => {
  const options = {
    xaxis: {
      categories: labels,
    },
    chart: {
      type: "area",

      foreColor: "#ccc",
      toolbar: {
        autoSelected: "pan",
        show: false,
      },
    },
    stroke: {
      width: 3,
    },
    grid: {
      borderColor: "#555",
      clipMarkers: false,
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: 5,
      strokeWidth: 3,
    },
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
            data: series,
            name: "views",
          },
        ]}
        type="area"
        width="100%"
        height={250}
      />
    </div>
  );
};

export default Charts;
