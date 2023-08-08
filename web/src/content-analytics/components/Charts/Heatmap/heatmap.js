import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import moment from "moment";


const HeatmapChart = ({ data }) => {
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    setSeriesData(data);
  }, [data]);

  let labels = Array.from({ length: 24 }, (_, i) => (i + 1).toString());
  labels = labels.map((item) => {
    return moment(item, "h a").format("h a");
  });

  const [chartData, _setChartData] = useState({
    options: {
      chart: {
        height: 350,
        type: "heatmap"
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#008FFB"],
      xaxis: {
        type: "category",
        categories: labels,
        tickAmount: labels?.length / 2,
        labels: {
          rotate: -0
        }
      },
      yaxis: {
        type: "category"
      },
      contextMenu: {
        // Set contextMenu to false to hide the menu
        enabled: false
      }
    }
  });

  return (
    <div id="chart">
      <ReactApexChart
        options={chartData.options}
        series={seriesData}
        type="heatmap"
        height={350}
      />
    </div>
  );
};

export default HeatmapChart;
