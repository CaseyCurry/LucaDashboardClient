import moment from "moment";

const getDefaultDateRange = () => {
  return {
    begin: moment()
      .subtract(5, "months")
      .format("YYYYMM"),
    end: moment().format("YYYYMM")
  };
};
const initialState = Object.freeze({
  areTransactionsLoading: false,
  expenses: [],
  expandedPeriods: [],
  selectedDateRange: getDefaultDateRange(),
  defaultDateRange: getDefaultDateRange()
});

export default (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_CATEGORY": {
      return Object.assign({}, state, {
        selectedDateRange: state.defaultDateRange
      });
    }
    case "GET_TRANSACTIONS_PENDING": {
      return Object.assign({}, state, { areTransactionsLoading: true });
    }
    case "GET_TRANSACTIONS_REJECTED": {
      return Object.assign({}, state, { areTransactionsLoading: false });
    }
    case "GET_TRANSACTIONS_FULFILLED": {
      const periods = action.payload
        .sort((x, y) => new Date(x.date) - new Date(y.date))
        .reduce((x, y) => {
          const period = moment(y.date).format("YYYYMM");
          if (!x[period]) {
            x[period] = {
              balance: 0,
              transactions: []
            };
          }
          x[period].balance += y.amount;
          x[period].transactions.push(y);
          return x;
        }, {});
      return Object.assign({}, state, {
        areTransactionsLoading: false,
        expenses: Object.keys(periods).map(period => {
          return {
            period,
            balance: periods[period].balance,
            transactions: periods[period].transactions
          };
        })
      });
    }
    case "SELECT_PERIOD": {
      const selectedDateRange = Object.assign({}, state.selectedDateRange, {
        begin: action.payload
      });
      return Object.assign({}, state, { selectedDateRange });
    }
    case "TOGGLE_PERIOD_EXPANSION": {
      let expandedPeriods = Array.from(state.expandedPeriods);
      if (expandedPeriods.includes(action.payload)) {
        expandedPeriods = expandedPeriods.filter(
          period => period !== action.payload
        );
      } else {
        expandedPeriods.push(action.payload);
      }
      return Object.assign({}, state, { expandedPeriods });
    }
  }

  return state;
};
