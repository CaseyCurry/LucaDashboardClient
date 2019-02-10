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
    this.props.onGetMetalStacks();
    this.props.onGetSpotPrices();
    this.props.onGetRetirementAccounts();
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
        incomeTypes={this.props.incomeTypes}
        currentPeriodRegularExpenses={this.props.currentPeriodRegularExpenses}
      />
    );
  }
}

DashboardContainer.propTypes = {
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
  incomeTypes: PropTypes.array.isRequired,
  currentPeriodRegularExpenses: PropTypes.number.isRequired
};

const mapStateToProps = state => {
  return state.dashboard;
};

const mapDispatchToProps = dispatch => {
  return {
    onGetCheckingAccounts: () => {
      dispatch(actions.getCheckingAccounts());
    },
    onGetMetalStacks: () => {
      dispatch(actions.getMetalStacks());
    },
    onGetSpotPrices: () => {
      dispatch(actions.getSpotPrices());
    },
    onGetRetirementAccounts: () => {
      dispatch(actions.getRetirementAccounts());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardContainer);
