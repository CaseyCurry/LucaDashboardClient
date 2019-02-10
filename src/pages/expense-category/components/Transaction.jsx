import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

class Transaction extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="transaction">
        <div>{this.props.subcategory}</div>
        <div>{this.props.id}</div>
        {this.props.isDeposit && <div>deposit</div>}
        <div title={this.props.description}>{this.props.description}</div>
        <div>{moment(this.props.date).format("MMM D, YYYY")}</div>
        <div>{this.props.amount}</div>
      </div>
    );
  }
}

Transaction.propTypes = {
  id: PropTypes.string.isRequired,
  subcategory: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  amount: PropTypes.number.isRequired,
  isDeposit: PropTypes.bool.isRequired
};

export default Transaction;
