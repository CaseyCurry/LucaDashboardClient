import React from "react";
import PropTypes from "prop-types";
import PercentChanged from "./Percent-Changed";

class MetalStack extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="metal-stack">
        <div className="secondary">
          {this.props.name.toLowerCase()}{" "}
          {this.props.totalCount.toLocaleString()}oz @ $
          {parseFloat(this.props.spotPrice.toFixed(2)).toLocaleString()}
        </div>
        <div className="icon">
          <img
            src="/resources/icons/coin.svg"
            alt={this.props.name.toLowerCase()}
          />
        </div>
        <div className="details">
          <div className="primary">
            ${parseFloat(this.props.value.toFixed(2)).toLocaleString()}
          </div>
          <div className="secondary">
            <PercentChanged amount={this.props.gainLoss} />
          </div>
        </div>
      </div>
    );
  }
}

MetalStack.propTypes = {
  areSpotPricesLoading: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  gainLoss: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  spotPrice: PropTypes.number.isRequired
};

export default MetalStack;
