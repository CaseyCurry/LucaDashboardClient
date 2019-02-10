import React from "react";
import PropTypes from "prop-types";
import { XYPlot, ArcSeries, DiscreteColorLegend } from "react-vis";

const colors = [
  "#C0392B", // red
  "#7FB3D5" // blue
];

class IncomeByType extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.types.length) {
      return <div />;
    }
    const sortedData = this.props.types
      .map(type => {
        return {
          subcategory: type.subcategory,
          amount: this.props.isCurrentPeriod
            ? type.currentPeriodAmount
            : type.currentYearAmount
        };
      })
      .sort((x, y) => x.amount - y.amount);
    // Add some padding to the highest income amount.
    const maxValue = sortedData[sortedData.length - 1].amount * 1.05;
    const data = sortedData.map(type => {
      const barWidth = 0.2;
      const padding = 0.05;
      const index = sortedData.indexOf(type);
      const radius0 = 1 + index * (barWidth + padding);
      const ratioOfMax = type.amount / maxValue;
      return Object.assign({}, type, {
        amount: `$${parseFloat(type.amount.toFixed(2)).toLocaleString()}`,
        ratio: `${ratioOfMax.toFixed(2)}%`,
        angle: Math.PI * 2 * ratioOfMax,
        angle0: 0,
        radius0,
        radius: radius0 + barWidth,
        color: type.subcategory.toLowerCase().indexOf("salary") >= 0 ? 0 : 1
      });
    });
    return (
      <div className="income-by-type">
        {this.props.isCurrentPeriod && (
          <div className="title">income last month</div>
        )}
        {!this.props.isCurrentPeriod && (
          <div className="title">income last year</div>
        )}
        <DiscreteColorLegend
          items={data
            .sort((x, y) => y.angle - x.angle)
            .map(type => {
              return {
                title: type.subcategory,
                color: colors[type.color],
                strokeWidth: 15
              };
            })}
        />
        <XYPlot xDomain={[-3, 3]} yDomain={[-3, 3]} width={300} height={300}>
          <ArcSeries
            animation={{
              damping: 9,
              stiffness: 300
            }}
            center={{ x: -1, y: 0 }}
            radiusDomain={[0, 3]}
            onValueMouseOver={(datapoint, event) => {
              console.log(datapoint, event);
            }}
            data={data}
            colorRange={colors}
          />
        </XYPlot>
      </div>
    );
  }
}

IncomeByType.propTypes = {
  isCurrentPeriod: PropTypes.bool.isRequired,
  types: PropTypes.array.isRequired
};

export default IncomeByType;
