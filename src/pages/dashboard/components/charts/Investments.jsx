import React from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";

class Investments extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const options = {
      legend: {
        labels: {
          fontColor: "white"
        }
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              callback: value => {
                return `$${value.toLocaleString()}`;
              },
              fontColor: "white"
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              display: false
            },
            type: "time",
            ticks: {
              fontColor: "white"
            }
          }
        ]
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            var label = data.datasets[tooltipItem.datasetIndex].label;
            label += " $";
            label += parseFloat(tooltipItem.yLabel.toFixed(2)).toLocaleString();
            return label;
          }
        }
      }
    };
    const data = {
      labels: this.props.periods.map(period => period.date),
      datasets: [
        {
          label: "Investments Made",
          fill: false,
          lineTension: 0.2,
          backgroundColor: "rgba(102, 204, 255, 0.7)",
          borderColor: "rgba(102, 204, 255, 1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          borderWidth: 0.5,
          pointBorderColor: "rgba(102, 204, 255, 1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 0.5,
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(102, 204, 255, 1)",
          pointHoverBorderColor: "rgba(102, 204, 255, 1)",
          pointHoverBorderWidth: 2,
          pointRadius: 0.0,
          pointHitRadius: 10,
          data: this.props.periods.map(period => period.investment)
        }
      ]
    };
    return (
      <div className="investments">
        <Line data={data} options={options} />
      </div>
    );
  }
}

Investments.propTypes = {
  periods: PropTypes.array.isRequired
};

export default Investments;
