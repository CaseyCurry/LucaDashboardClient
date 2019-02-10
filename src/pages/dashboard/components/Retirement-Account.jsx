import React from "react";
import PropTypes from "prop-types";

class RetirementAccount extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="retirement-account">
        <div className="secondary">{this.props.name}</div>
        <div className="icon">
          <img
            src="/resources/icons/retirement.svg"
            alt={this.props.name.toLowerCase()}
          />
        </div>
        <div className="details">
          <div className="primary">
            ${parseFloat(this.props.balance.toFixed(2)).toLocaleString()}
          </div>
          <div className="secondary">{this.props.brokerage}</div>
        </div>
      </div>
    );
  }
}

RetirementAccount.propTypes = {
  name: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  brokerage: PropTypes.string.isRequired
};

export default RetirementAccount;
