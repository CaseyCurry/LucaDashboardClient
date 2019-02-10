import React from "react";
import PropTypes from "prop-types";

class Balance extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="checking-account">
        <div className="secondary">checking account</div>
        <div className="icon">
          <img src="/resources/icons/checking.svg" alt="checking" />
        </div>
        <div className="details">
          <div className="primary">
            ${parseFloat(this.props.amount.toFixed(2)).toLocaleString()}
          </div>
          <div className="secondary">{this.props.description}</div>
        </div>
      </div>
    );
  }
}

Balance.propTypes = {
  amount: PropTypes.number.isRequired,
  description: PropTypes.string
};

export default Balance;
