import React from "react";
import PropTypes from "prop-types";
import Loader from "../../../controls/Loader";
import Balance from "./Balance";
import Rule from "./Rule";
import CheckingAccount from "./Checking-Account";
import RetirementAccount from "./Retirement-Account";
import MetalStack from "./Metal-Stack";
import Expense from "./Expense";
import Savings from "./charts/Savings";
import IncomeVsExpenses from "./charts/Income-Vs-Expenses";
import IncomeByType from "./charts/Income-By-Type";
import Investments from "./charts/Investments";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (
      this.props.areCheckingAccountsLoading ||
      this.props.areMetalStacksLoading ||
      this.props.areSpotPricesLoading ||
      this.props.areRetirementAccountsLoading
    ) {
      return (
        <div className="page">
          <Loader />
        </div>
      );
    }
    const tileClass = "tile col-sm-6 col-md-4 col-lg-3";
    return (
      <div className="dashboard page">
        <div className="row">
          <div className={tileClass}>
            <Balance name="net worth" amount={this.props.netWorth} />
          </div>
          <div className={tileClass}>
            <Rule
              percent={2}
              netWorth={this.props.netWorth}
              monthlyExpenses={this.props.currentPeriodRegularExpenses}
            />
          </div>
          <div className={tileClass}>
            <Rule
              percent={3}
              netWorth={this.props.netWorth}
              monthlyExpenses={this.props.currentPeriodRegularExpenses}
            />
          </div>
          <div className={tileClass}>
            <Rule
              percent={4}
              netWorth={this.props.netWorth}
              monthlyExpenses={this.props.currentPeriodRegularExpenses}
            />
          </div>
          {this.props.checkingAccounts.map(account => {
            return (
              <div key={account.name} className={tileClass}>
                <CheckingAccount
                  amount={account.balance}
                  description={account.name}
                />
              </div>
            );
          })}
          {this.props.retirementAccounts.map(account => {
            return (
              <div key={account.name} className={tileClass}>
                <RetirementAccount
                  name={account.name}
                  balance={account.balance}
                  brokerage={account.brokerage}
                />
              </div>
            );
          })}
          {this.props.metalStacks.map(stack => {
            return (
              <div key={stack.name} className={tileClass}>
                <MetalStack
                  areSpotPricesLoading={this.props.areSpotPricesLoading}
                  name={stack.name}
                  value={stack.value}
                  gainLoss={stack.gainLoss}
                  totalCount={stack.totalCount}
                  spotPrice={stack.spotPrice}
                />
              </div>
            );
          })}
        </div>
        <div className="row">
          {this.props.expensesByCategory.map(expense => {
            return (
              <div className={tileClass} key={expense.category}>
                <Expense
                  category={expense.category}
                  currentMonth={expense.currentMonth}
                  previousMonth={expense.previousMonth}
                  currentYear={expense.currentYear}
                  previousYear={expense.previousYear}
                />
              </div>
            );
          })}
        </div>
        <div className="row">
          <div className="tile col-12">
            <IncomeVsExpenses
              incomeTypes={this.props.incomeTypes}
              expensesBySubcategory={this.props.expensesBySubcategory}
            />
          </div>
        </div>
        <div className="row">
          <div className="tile col-12 col-md-6">
            <IncomeByType
              isCurrentPeriod={true}
              types={this.props.incomeTypes}
            />
          </div>
          <div className="tile col-12 col-md-6">
            <IncomeByType
              isCurrentPeriod={false}
              types={this.props.incomeTypes}
            />
          </div>
        </div>
        <div className="row">
          <div className="tile col-12 col-lg-6">
            <Savings periods={this.props.periodMetrics} />
          </div>
          <div className="tile col-12 col-lg-6">
            <Investments periods={this.props.periodMetrics} />
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  areCheckingAccountsLoading: PropTypes.bool.isRequired,
  checkingAccounts: PropTypes.array.isRequired,
  expensesByCategory: PropTypes.array.isRequired,
  expensesBySubcategory: PropTypes.array.isRequired,
  areMetalStacksLoading: PropTypes.bool.isRequired,
  metalStacks: PropTypes.array.isRequired,
  areSpotPricesLoading: PropTypes.bool.isRequired,
  areRetirementAccountsLoading: PropTypes.bool.isRequired,
  retirementAccounts: PropTypes.array.isRequired,
  netWorth: PropTypes.number.isRequired,
  periodMetrics: PropTypes.array.isRequired,
  incomeTypes: PropTypes.array.isRequired,
  currentPeriodRegularExpenses: PropTypes.number.isRequired
};

export default Dashboard;
