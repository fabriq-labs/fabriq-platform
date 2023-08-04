import React from "react";
import ReactApexChart from "react-apexcharts";

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Current",
          data: this.generateRandomData()
        },
        {
          name: "Average",
          data: this.generateRandomData()
        }
      ],
      options: {
        chart: {
          id: "realtime",
          height: 350,
          type: "line",
          animations: {
            enabled: true,
            easing: "linear",
            dynamicAnimation: {
              speed: 1000
            }
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },
        title: {
          text: "Dynamic Updating Chart",
          align: "left"
        },
        markers: {
          size: 0
        },
        xaxis: {
          type: "datetime",
          range: 60000 // X-axis range in milliseconds (1 minute)
        },
        yaxis: {
          max: 100
        },
        legend: {
          show: false
        }
      }
    };
  }

  componentDidMount() {
    this.updateChartDataInterval = window.setInterval(() => {
      this.setState({
        series: [
          {
            name: "Current",
            data: this.generateRandomData()
          },
          {
            name: "Average",
            data: this.generateRandomData()
          }
        ]
      });
    }, 1000); // Update data every 1 second
  }

  componentWillUnmount() {
    clearInterval(this.updateChartDataInterval);
  }

  generateRandomData() {
    const data = [];
    let baseTime = new Date().getTime() - 60000; // One minute ago
    for (let i = 0; i < 10; i++) {
      // Generating 10 data points
      baseTime += 6000; // Adding 6 seconds interval between data points
      data.push({
        x: baseTime,
        y: Math.floor(Math.random() * 100) + 1 // Random value between 1 and 100
      });
    }
    return data;
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={350}
        />
      </div>
    );
  }
}

export default ApexChart;
