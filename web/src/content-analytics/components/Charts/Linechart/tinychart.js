import React from "react";
import Chart from "react-apexcharts";

class LineChartTiny extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: props?.series?.length > 0 ? props?.series : [
        {
          name: "Page Views",
          data: [
            30, 40, 25, 50, 49, 21, 70, 51, 42, 60, 30, 40, 25, 50, 49, 21, 70,
            51, 42, 60
          ]
        }
      ],
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
          show: false,
          labels: {
            show: false // This disables x-axis plots label
          }
        },
        yaxis: {
          show: false
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
      this.setState({ series: series.length > 0 ? series : this.state.series });
    }
  }

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
