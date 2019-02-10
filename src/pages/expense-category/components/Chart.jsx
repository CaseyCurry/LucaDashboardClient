import React from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import moment from "moment";

class Chart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    const options = {
      maintainAspectRatio: false,
      onClick: function(e) {
        var label = this.scales["x-axis-0"].getValueForPixel(e.x + 5);
        props.onSelectPeriod(label.format("YYYYMM"));
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              color: "transparent",
              display: true,
              drawBorder: false,
              zeroLineColor: "#696969",
              zeroLineWidth: 0.5
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
            time: {
              min: moment()
                .subtract(1, "days")
                .subtract(2, "years"),
              max: moment()
            },
            ticks: {
              fontColor: "white",
              major: {
                fontColor: "yellow"
              },
              autoSkip: false,
              maxRotation: 90,
              minRotation: 90,
              callback: function(value, index, values) {
                const tick = values[index];
                if (tick) {
                  // This will apply the major tick font color
                  tick.major =
                    moment(tick.value).format("YYYYMM") >=
                      props.dateRange.begin &&
                    moment(tick.value).format("YYYYMM") <= props.dateRange.end;
                }
                return value;
              }
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
      labels: this.props.expenses.map(expense =>
        moment(expense.period, "YYYYMM")
      ),
      datasets: [
        {
          label: "Expenses",
          fill: false,
          lineTension: 0.1,
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
          data: this.props.expenses.map(period => period.balance)
        }
      ]
    };
    return (
      <div className="chart">
        <Line redraw={true} data={data} options={options} height={250} />
      </div>
    );
  }
}

Chart.propTypes = {
  expenses: PropTypes.array.isRequired,
  dateRange: PropTypes.object.isRequired,
  onSelectPeriod: PropTypes.func.isRequired
};

export default Chart;
