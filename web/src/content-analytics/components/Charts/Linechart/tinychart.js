import React from "react";
import Chart from "react-apexcharts";

import { formatNumber } from "../../../../utils/helper";

class LineChartTiny extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series:
        props?.series?.length > 0
          ? props?.series
          : [
              {
                name: "Page Views",
                data: [
                  30, 40, 25, 50, 49, 21, 70, 51, 42, 60, 30, 40, 25, 50, 49,
                  21, 70, 51, 42, 60
                ]
              }
            ],
      labels: props?.labels ? props?.labels : [],
      options: {
        chart: {
          id: "line-chart",
          width: 50,
          height: 100,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
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
        legend: {
          show: false
        },
        xaxis: {
          show: true,
          categories: props?.labels ? props?.labels : [],
          labels: {
            show: false // This disables x-axis plots label
          }
        },
        yaxis: {
          show: false,
          labels: {
            formatter: function (value) {
              return formatNumber(value);
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        }
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.series !== this.props.series) {
      const { series } = this.props;
      this.setState({
        series: series.length > 0 ? series : this.state.series
      });
    }
    if (prevProps.labels !== this.props.labels) {
      const { labels } = this.props;
      this.setState(
        {
          labels: labels ? labels : this.state.labels
        },
        () => {
          // Call the function to update the chart options after updating the labels
          this.updateChartOptions();
        }
      );
    }
  }

  updateChartOptions = () => {
    const { labels } = this.state;
    const newOptions = {
      ...this.state.options,
      xaxis: {
        ...this.state.options.xaxis,
        categories: labels // Update the categories with the new labels
      }
    };
    this.setState({
      options: newOptions
    });
  };

  render() {
    return (
      <Chart
        options={this.state.options}
        series={this.state.series}
        type="area"
        width="100%"
        height={100}
      />
    );
  }
}

export default LineChartTiny;
