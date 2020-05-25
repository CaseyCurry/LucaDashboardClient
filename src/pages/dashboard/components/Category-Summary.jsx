import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import PercentChanged from "./Percent-Changed";

class CategorySummary extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const summary = (
      <div>
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
      </div>
    );
    return (
      <div className="category-summary">
        {this.props.isCalculated && summary}
        {!this.props.isCalculated && (
          <Link to={`/expense-category/${this.props.category}`}>{summary}</Link>
        )}
      </div>
    );
  }
}

CategorySummary.propTypes = {
  category: PropTypes.string.isRequired,
  currentMonth: PropTypes.number.isRequired,
  previousMonth: PropTypes.number.isRequired,
  currentYear: PropTypes.number.isRequired,
  previousYear: PropTypes.number.isRequired,
  isCalculated: PropTypes.bool
};

export default CategorySummary;
