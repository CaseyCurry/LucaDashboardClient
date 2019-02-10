import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import PercentChanged from "./Percent-Changed";

class Expense extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="expense">
        <Link to={`/expense-category/${this.props.category}`}>
          <div className="secondary">{this.props.category}</div>
          <div className="primary">
            ${parseFloat(this.props.currentMonth.toFixed(2)).toLocaleString()}
          </div>
          <div className="secondary">
            <PercentChanged amount={this.props.previousMonth} />
          </div>
          <div className="primary">
            ${parseFloat(this.props.currentYear.toFixed(2)).toLocaleString()}
          </div>
          <div className="secondary">
            <PercentChanged amount={this.props.previousYear} />
          </div>
        </Link>
      </div>
    );
  }
}

Expense.propTypes = {
  category: PropTypes.string.isRequired,
  currentMonth: PropTypes.number.isRequired,
  previousMonth: PropTypes.number.isRequired,
  currentYear: PropTypes.number.isRequired,
  previousYear: PropTypes.number.isRequired
};

export default Expense;
