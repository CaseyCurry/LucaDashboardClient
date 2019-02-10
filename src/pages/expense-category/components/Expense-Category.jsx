import React from "react";
import PropTypes from "prop-types";
import Loader from "../../../controls/Loader";
import Chart from "./Chart";
import Period from "./Period";

class ExpenseCategory extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.areTransactionsLoading) {
      return (
        <div className="page">
          <Loader />
        </div>
      );
    }
    return (
      <div className="expense-category page">
        <Chart
          expenses={this.props.expenses}
          dateRange={this.props.dateRange}
          onSelectPeriod={this.props.onSelectPeriod}
        />
        {this.props.expenses.map(expense => {
          return (
            <Period
              key={expense.period}
              period={expense.period}
              isExpanded={this.props.expandedPeriods.includes(expense.period)}
              transactions={expense.transactions}
              onTogglePeriodExpansion={this.props.onTogglePeriodExpansion}
            />
          );
        })}
      </div>
    );
  }
}

ExpenseCategory.propTypes = {
  areTransactionsLoading: PropTypes.bool.isRequired,
  expenses: PropTypes.array.isRequired,
  expandedPeriods: PropTypes.array.isRequired,
  dateRange: PropTypes.object.isRequired,
  onSelectPeriod: PropTypes.func.isRequired,
  onTogglePeriodExpansion: PropTypes.func.isRequired
};

export default ExpenseCategory;
