import React from "react";
import Chart from "react-apexcharts";

export default class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: this.props.series,
      options: {
        chart: {
          type: "boxPlot",
          height: 350
        },
        plotOptions: {
          boxPlot: {
            colors: {
              upper: "#5C4742",
              lower: "#A5978B"
            }
          }
        }
      }
    };
  }

  render() {
    return (
      <div id="chart">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="boxPlot"
          height={350}
        />
      </div>
    );
  }
}
