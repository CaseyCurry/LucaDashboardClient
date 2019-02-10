import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import Transaction from "./Transaction";

class Period extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="period">
        <div
          onClick={() => this.props.onTogglePeriodExpansion(this.props.period)}
        >
          {moment(this.props.period, "YYYYMM").format("MMM YYYY")}
        </div>
        {this.props.isExpanded &&
          this.props.transactions.map(transaction => {
            return (
              <Transaction
                key={transaction.id}
                id={transaction.id}
                subcategory={transaction.categorization.subcategory}
                description={transaction.description}
                date={new Date(transaction.date)}
                amount={transaction.amount}
                isDeposit={transaction.isDeposit}
              />
            );
          })}
      </div>
    );
  }
}

Period.propTypes = {
  period: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  transactions: PropTypes.array.isRequired,
  onTogglePeriodExpansion: PropTypes.func.isRequired
};

export default Period;
