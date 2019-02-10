import moment from "moment";

const periods = {
  currentPeriod: moment()
    .subtract(1, "months")
    .format("YYYYMM"),
  previousPeriod: moment()
    .subtract(2, "months")
    .format("YYYYMM"),
  currentYear: {
    begin: moment()
      .subtract(1, "years")
      .format("YYYYMM"),
    end: moment()
      .subtract(1, "months")
      .format("YYYYMM")
  },
  previousYear: {
    begin: moment()
      .subtract(2, "years")
      .format("YYYYMM"),
    end: moment()
      .subtract(1, "years")
      .subtract(1, "months")
      .format("YYYYMM")
  }
};

const initialState = Object.freeze({
  areCheckingAccountsLoading: false,
  checkingAccounts: [],
  expensesByCategory: [],
  expensesBySubcategory: [],
  areMetalStacksLoading: false,
  metalStacks: [],
  areSpotPricesLoading: false,
  spotPrices: { au: 0, ag: 0 },
  areRetirementAccountsLoading: false,
  retirementAccounts: [],
  netWorth: 0,
  periodMetrics: [],
  incomeTypes: [],
  currentPeriodRegularExpenses: 0
});

const getCheckingAccountBalances = accounts => {
  return accounts.map(account => {
    const balance = account.balances.reduce((x, y) => x + y.amount, 0);
    return {
      name: account.name,
      balance
    };
  });
};

const getPercentChanged = (x, y) => {
  let change = 0;
  if (x && y) {
    change = x > y ? y / x : x / y;
    change = (1 - change) * 100;
    if (x < y) {
      change = change * -1;
    }
  }
  return change;
};

const getExpensesByCategory = accounts => {
  if (!accounts.length) {
    return [];
  }
  const categories = accounts
    .reduce((x, y) => {
      x.push(...y.balances);
      return x;
    }, [])
    .filter(balance => {
      return (
        balance.period >= periods.previousYear.begin &&
        balance.period <= periods.currentPeriod
      );
    })
    .map(balance => {
      return {
        category: balance.categorization.category,
        period: balance.period,
        amount:
          balance.categorization.category === "income"
            ? balance.amount
            : balance.amount * -1
      };
    })
    .reduce((x, { category, period, amount }) => {
      if (!x[category]) {
        x[category] = {
          currentMonth: 0,
          previousMonth: 0,
          currentYear: 0,
          previousYear: 0
        };
      }
      if (
        period >= periods.currentYear.begin &&
        period <= periods.currentYear.end
      ) {
        x[category].currentYear += amount;
      } else {
        x[category].previousYear += amount;
      }
      if (period === periods.currentPeriod) {
        x[category].currentMonth += amount;
      } else if (period === periods.previousPeriod) {
        x[category].previousMonth += amount;
      }
      return x;
    }, {});
  return Object.keys(categories)
    .map(category => {
      const currentMonth = categories[category].currentMonth;
      const previousMonth = categories[category].previousMonth;
      const currentYear = categories[category].currentYear;
      const previousYear = categories[category].previousYear;
      return {
        category,
        currentMonth,
        previousMonth: getPercentChanged(currentMonth, previousMonth),
        currentYear,
        previousYear: getPercentChanged(currentYear, previousYear)
      };
    })
    .sort((x, y) => y.currentMonth - x.currentMonth);
};

const getExpensesBySubcategory = accounts => {
  const categories = accounts
    .reduce((x, y) => x.concat(...y.balances), [])
    .filter(balance => balance.categorization.category !== "income")
    .filter(
      balance =>
        balance.period >= periods.currentYear.begin &&
        balance.period <= periods.currentYear.end
    )
    .reduce((x, y) => {
      const category = y.categorization.category;
      if (!x[category]) {
        x[category] = {};
      }
      const subcategory = y.categorization.subcategory;
      if (!x[category][subcategory]) {
        x[category][subcategory] = {
          currentPeriodAmount: 0,
          currentYearAmount: 0
        };
      }
      if (y.period === periods.currentPeriod) {
        x[category][subcategory].currentPeriodAmount += y.amount * -1;
      }
      x[category][subcategory].currentYearAmount += y.amount * -1;
      return x;
    }, {});
  return Object.keys(categories).map(category => {
    const subcategories = Object.keys(categories[category]).map(subcategory => {
      return Object.assign({}, categories[category][subcategory], {
        subcategory
      });
    });
    return {
      category,
      subcategories
    };
  });
};

const getPeriodMetrics = accounts => {
  const periods = accounts
    .reduce((x, y) => x.concat(...y.balances), [])
    .reduce((x, y) => {
      const period = y.period;
      const income = y.categorization.category === "income" ? y.amount : 0;
      const expense =
        y.categorization.category !== "income" &&
        y.categorization.category !== "investments"
          ? y.amount * -1
          : 0;
      const investment =
        y.categorization.category === "investments" ? y.amount * -1 : 0;
      if (!x[period]) {
        x[period] = { income: 0, expense: 0, investment: 0 };
      }
      x[period].income += income;
      x[period].expense += expense;
      x[period].investment += investment;
      return x;
    }, {});
  return Object.keys(periods)
    .filter(period => period !== "201212") // 2013 is the beginning of time.
    .sort((x, y) => new Date(x) - new Date(y))
    .map(period => {
      const date = moment(period, "YYYYMM");
      return {
        date,
        income: periods[period].income,
        expense: periods[period].expense,
        investment: periods[period].investment,
        savingsRate:
          ((periods[period].income - periods[period].expense) /
            periods[period].income) *
          100
      };
    });
};

const getIncomeTypes = accounts => {
  const subcategories = accounts
    .reduce((x, y) => x.concat(...y.balances), [])
    .filter(balance => balance.categorization.category === "income")
    .filter(
      balance =>
        balance.period >= periods.currentYear.begin &&
        balance.period <= periods.currentYear.end
    )
    .reduce((x, y) => {
      const subcategory = y.categorization.subcategory;
      if (!x[subcategory]) {
        x[subcategory] = {
          currentPeriodAmount: 0,
          currentYearAmount: 0
        };
      }
      if (y.period === periods.currentPeriod) {
        x[subcategory].currentPeriodAmount += y.amount;
      }
      x[subcategory].currentYearAmount += y.amount;
      return x;
    }, {});
  return Object.keys(subcategories).map(subcategory => {
    return Object.assign({}, subcategories[subcategory], { subcategory });
  });
};

const calculateNetWorth = (
  checkingAccounts,
  metalStacks,
  spotPrices,
  retirementAccounts
) => {
  const checkingAccountTotal = checkingAccounts.reduce(
    (x, y) => x + y.balance,
    0
  );
  const metalStackTotal = metalStacks.reduce((x, y) => x + y.value, 0);
  const retirementAccountTotal = retirementAccounts.reduce(
    (x, y) => x + y.balance,
    0
  );
  return checkingAccountTotal + metalStackTotal + retirementAccountTotal;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "GET_CHECKING_ACCOUNTS_PENDING": {
      return Object.assign({}, state, {
        areCheckingAccountsLoading: true
      });
    }
    case "GET_CHECKING_ACCOUNTS_REJECTED": {
      return Object.assign({}, state, {
        areCheckingAccountsLoading: false
      });
    }
    case "GET_CHECKING_ACCOUNTS_FULFILLED": {
      const checkingAccounts = getCheckingAccountBalances(action.payload);
      const incomeTypes = getIncomeTypes(action.payload);
      const expensesByCategory = getExpensesByCategory(action.payload);
      const expensesBySubcategory = getExpensesBySubcategory(action.payload);
      const netWorth = calculateNetWorth(
        checkingAccounts,
        state.metalStacks,
        state.spotPrices,
        state.retirementAccounts
      );
      const periodMetrics = getPeriodMetrics(action.payload);
      const currentPeriodRegularExpenses = periodMetrics.find(
        metrics => metrics.date.format("YYYYMM") === periods.currentPeriod
      ).expense;
      return Object.assign({}, state, {
        checkingAccounts,
        expensesByCategory,
        expensesBySubcategory,
        netWorth,
        periodMetrics,
        incomeTypes,
        currentPeriodRegularExpenses,
        areCheckingAccountsLoading: false
      });
    }
    case "GET_METAL_STACKS_PENDING": {
      return Object.assign({}, state, {
        areMetalStacksLoading: true
      });
    }
    case "GET_METAL_STACKS_REJECTED": {
      return Object.assign({}, state, {
        areMetalStacksLoading: false
      });
    }
    case "GET_METAL_STACKS_FULFILLED": {
      const metalStacks = action.payload.map(stack => {
        const spotPrice =
          stack.name.toLowerCase() === "gold"
            ? state.spotPrices.au
            : state.spotPrices.ag;
        const value = stack.totalCount * spotPrice;
        return {
          name: stack.name,
          totalCount: stack.totalCount,
          totalCost: stack.totalCost,
          value,
          gainLoss: getPercentChanged(value, stack.totalCost),
          spotPrice
        };
      });
      const netWorth = calculateNetWorth(
        state.checkingAccounts,
        metalStacks,
        state.spotPrices,
        state.retirementAccounts
      );
      return Object.assign({}, state, {
        metalStacks,
        netWorth,
        areMetalStacksLoading: false
      });
    }
    case "GET_SPOT_PRICES_PENDING": {
      return Object.assign({}, state, {
        areSpotPricesLoading: true
      });
    }
    case "GET_SPOT_PRICES_REJECTED": {
      return Object.assign({}, state, {
        areSpotPricesLoading: false
      });
    }
    case "GET_SPOT_PRICES_FULFILLED": {
      const metalStacks = state.metalStacks.map(stack => {
        const spotPrice =
          stack.name.toLowerCase() === "gold"
            ? action.payload.au
            : action.payload.ag;
        const value = stack.totalCount * spotPrice;
        return {
          name: stack.name,
          totalCount: stack.totalCount,
          totalCost: stack.totalCost,
          value,
          gainLoss: getPercentChanged(value, stack.totalCost),
          spotPrice
        };
      });
      const netWorth = calculateNetWorth(
        state.checkingAccounts,
        metalStacks,
        action.payload,
        state.retirementAccounts
      );
      return Object.assign({}, state, {
        spotPrices: action.payload,
        metalStacks,
        netWorth,
        areSpotPricesLoading: false
      });
    }
    case "GET_RETIREMENT_ACCOUNTS_PENDING": {
      return Object.assign({}, state, {
        areRetirementAccountsLoading: true
      });
    }
    case "GET_RETIREMENT_ACCOUNTS_REJECTED": {
      return Object.assign({}, state, {
        areRetirementAccountsLoading: false
      });
    }
    case "GET_RETIREMENT_ACCOUNTS_FULFILLED": {
      const netWorth = calculateNetWorth(
        state.checkingAccounts,
        state.metalStacks,
        state.spotPrices,
        action.payload
      );
      return Object.assign({}, state, {
        retirementAccounts: action.payload,
        netWorth,
        areRetirementAccountsLoading: false
      });
    }
  }

  return state;
};
