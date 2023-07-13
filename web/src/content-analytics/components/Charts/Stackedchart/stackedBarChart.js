// BarChart
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const StackedBarChart = ({ series, colors, max, legend, height }) => {
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    setSeriesData(series);
  }, [series]);

  return (
    <ReactApexChart
      options={{
        xaxis: {
          categories: [""],
          show: false,
          max: max && 100,
          labels: {
            show: false
          }
        },
        colors: colors,
        stroke: {
          width: 1,
          colors: ["transparant"]
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
        tooltip: {
          x: {
            show: true
          },
          y: {
            formatter: function (val) {
              return `${val.toFixed(2)} %`;
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        chart: {
          type: "bar",
          height: 100,
          stacked: true,
          toolbar: {
            show: false
          }
        },
        legend: {
          show: legend,
          showForSingleSeries: legend
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              total: {
                enabled: false,
                offsetX: 0,
                style: {
                  fontSize: "13px",
                  fontWeight: 900
                }
              }
            }
          }
        }
      }}
      series={seriesData}
      type="bar"
      height={height}
      width="100%"
    />
  );
};

export default StackedBarChart;
