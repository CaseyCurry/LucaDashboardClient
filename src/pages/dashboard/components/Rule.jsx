import React from "react";
import PropTypes from "prop-types";

class Rule extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const portionOfNetWorth = this.props.netWorth * (this.props.percent / 100);
    const yearlyExpenses = this.props.monthlyExpenses * 12;
    return (
      <div className="rule">
        <div className="icon">
          <span>{this.props.percent}%</span>
          <div>rule</div>
        </div>
        <div className="details">
          <div className="primary">
            ${parseFloat(portionOfNetWorth.toFixed(2)).toLocaleString()}
          </div>
          <div className="secondary">
            {((portionOfNetWorth / yearlyExpenses) * 100).toFixed(1)}
            {"% of last month's expenses"}
          </div>
        </div>
      </div>
    );
  }
}

Rule.propTypes = {
  percent: PropTypes.number.isRequired,
  netWorth: PropTypes.number.isRequired,
  monthlyExpenses: PropTypes.number.isRequired
};

export default Rule;
