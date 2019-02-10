import React from "react";
import PropTypes from "prop-types";

class Balance extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="balance">
        <div className="icon">
          {this.props.name.toLowerCase() === "net worth" && (
            <img
              src="/resources/icons/money.svg"
              alt={this.props.name.toLowerCase()}
            />
          )}
        </div>
        <div className="details">
          <div className="secondary">{this.props.name.toLowerCase()}</div>
          <div className="primary">
            ${parseFloat(this.props.amount.toFixed(2)).toLocaleString()}
          </div>
        </div>
      </div>
    );
  }
}

Balance.propTypes = {
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired
};

export default Balance;
