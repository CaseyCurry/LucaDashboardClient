import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "./actions";
import ExpenseCategory from "./components/Expense-Category";

class ExpenseCategoryContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onLoadCategory();
    this.props.onGetTransactions(
      this.props.match.params.category,
      this.props.defaultDateRange.begin,
      this.props.defaultDateRange.end
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDateRange && this.props.selectedDateRange) {
      if (
        nextProps.selectedDateRange.begin !==
          this.props.selectedDateRange.begin ||
        nextProps.selectedDateRange.end !== this.props.selectedDateRange.end
      ) {
        this.props.onGetTransactions(
          this.props.match.params.category,
          nextProps.selectedDateRange.begin,
          nextProps.selectedDateRange.end
        );
      }
    }
  }

  render() {
    return (
      <ExpenseCategory
        areTransactionsLoading={this.props.areTransactionsLoading}
        expenses={this.props.expenses}
        expandedPeriods={this.props.expandedPeriods}
        dateRange={this.props.selectedDateRange}
        onSelectPeriod={this.props.onSelectPeriod}
        onTogglePeriodExpansion={this.props.onTogglePeriodExpansion}
      />
    );
  }
}

ExpenseCategoryContainer.propTypes = {
  match: PropTypes.object.isRequired,
  areTransactionsLoading: PropTypes.bool.isRequired,
  expenses: PropTypes.array.isRequired,
  expandedPeriods: PropTypes.array.isRequired,
  selectedDateRange: PropTypes.object.isRequired,
  defaultDateRange: PropTypes.object.isRequired,
  onLoadCategory: PropTypes.func.isRequired,
  onGetTransactions: PropTypes.func.isRequired,
  onSelectPeriod: PropTypes.func.isRequired,
  onTogglePeriodExpansion: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return state.expenseCategory;
};

const mapDispatchToProps = dispatch => {
  return {
    onGetTransactions: (category, beginningPeriod, endingPeriod) => {
      dispatch(
        actions.getTransactions(category, beginningPeriod, endingPeriod)
      );
    },
    onSelectPeriod: period => {
      dispatch(actions.selectPeriod(period));
    },
    onLoadCategory: () => {
      dispatch(actions.loadCategory);
    },
    onTogglePeriodExpansion: period => {
      dispatch(actions.togglePeriodExpansion(period));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpenseCategoryContainer);
