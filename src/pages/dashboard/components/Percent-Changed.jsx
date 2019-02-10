import React from "react";
import PropTypes from "prop-types";

class PercentChanged extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="percent-changed">
        {this.props.amount > 0 && (
          <img src="/resources/icons/up.svg" alt="gain" />
        )}
        {this.props.amount < 0 && (
          <img src="/resources/icons/down.svg" alt="loss" />
        )}{" "}
        {this.props.amount === 0 && (
          <img src="/resources/icons/dash.svg" alt="no change" />
        )}
        <span>{`${Math.abs(this.props.amount).toFixed(1)}%`}</span>
      </div>
    );
  }
}

PercentChanged.propTypes = {
  amount: PropTypes.number.isRequired
};

export default PercentChanged;
