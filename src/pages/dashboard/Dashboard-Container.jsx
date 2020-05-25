import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "./actions";
import Dashboard from "./components/Dashboard";

class DashboardContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onGetCheckingAccounts();
    this.props.onGetCategorizedBalances(
      this.props.periods.previousYear.begin,
      this.props.periods.currentYear.end
    );
    this.props.onGetMetalStacks();
    this.props.onGetSpotPrices();
    this.props.onGetRetirementAccounts();
    this.props.onGetBadPurchases();
    this.props.onGetCategories();
  }

  render() {
    return (
      <Dashboard
        areCheckingAccountsLoading={this.props.areCheckingAccountsLoading}
        checkingAccounts={this.props.checkingAccounts}
        expensesByCategory={this.props.expensesByCategory}
        expensesBySubcategory={this.props.expensesBySubcategory}
        areMetalStacksLoading={this.props.areMetalStacksLoading}
        metalStacks={this.props.metalStacks}
        areSpotPricesLoading={this.props.areSpotPricesLoading}
        areRetirementAccountsLoading={this.props.areRetirementAccountsLoading}
        retirementAccounts={this.props.retirementAccounts}
        netWorth={this.props.netWorth}
        periodMetrics={this.props.periodMetrics}
        savingsSummary={this.props.savingsSummary}
        incomeTypes={this.props.incomeTypes}
        currentMonthRegularExpenses={this.props.currentMonthRegularExpenses}
        areBadPurchasesLoading={this.props.areBadPurchasesLoading}
        badPurchases={this.props.badPurchases}
        areCategorizedBalancesLoading={this.props.areCategorizedBalancesLoading}
        areCategoriesLoading={this.props.areCategoriesLoading}
      />
    );
  }
}

DashboardContainer.propTypes = {
  periods: PropTypes.object.isRequired,
  areCheckingAccountsLoading: PropTypes.bool.isRequired,
  checkingAccounts: PropTypes.array.isRequired,
  expensesByCategory: PropTypes.array.isRequired,
  expensesBySubcategory: PropTypes.array.isRequired,
  onGetCheckingAccounts: PropTypes.func.isRequired,
  areMetalStacksLoading: PropTypes.bool.isRequired,
  metalStacks: PropTypes.array.isRequired,
  onGetMetalStacks: PropTypes.func.isRequired,
  areSpotPricesLoading: PropTypes.bool.isRequired,
  onGetSpotPrices: PropTypes.func.isRequired,
  areRetirementAccountsLoading: PropTypes.bool.isRequired,
  retirementAccounts: PropTypes.array.isRequired,
  onGetRetirementAccounts: PropTypes.func.isRequired,
  netWorth: PropTypes.number.isRequired,
  periodMetrics: PropTypes.array.isRequired,
  savingsSummary: PropTypes.object,
  incomeTypes: PropTypes.array.isRequired,
  currentMonthRegularExpenses: PropTypes.number.isRequired,
  onGetBadPurchases: PropTypes.func.isRequired,
  areBadPurchasesLoading: PropTypes.bool.isRequired,
  badPurchases: PropTypes.object.isRequired,
  onGetCategorizedBalances: PropTypes.func.isRequired,
  areCategorizedBalancesLoading: PropTypes.bool.isRequired,
  areCategoriesLoading: PropTypes.bool.isRequired,
  onGetCategories: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return state.dashboard;
};

const mapDispatchToProps = dispatch => {
  return {
    onGetCheckingAccounts: () => {
      dispatch(actions.getCheckingAccounts());
    },
    onGetCategorizedBalances: (beginningPeriod, endingPeriod) => {
      dispatch(actions.getCategorizedBalances(beginningPeriod, endingPeriod));
    },
    onGetCategories: () => {
      dispatch(actions.getCategories());
    },
    onGetMetalStacks: () => {
      dispatch(actions.getMetalStacks());
    },
    onGetSpotPrices: () => {
      dispatch(actions.getSpotPrices());
    },
    onGetRetirementAccounts: () => {
      dispatch(actions.getRetirementAccounts());
    },
    onGetBadPurchases: () => {
      dispatch(actions.getBadPurchases());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardContainer);
