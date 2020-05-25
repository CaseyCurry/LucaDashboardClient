import moment from "moment";

const periods = {
  currentPeriod: parseInt(
    moment()
      .subtract(1, "months")
      .format("YYYYMM")
  ),
  previousPeriod: parseInt(
    moment()
      .subtract(2, "months")
      .format("YYYYMM")
  ),
  currentYear: {
    begin: parseInt(
      moment()
        .subtract(1, "years")
        .format("YYYYMM")
    ),
    end: parseInt(
      moment()
        .subtract(1, "months")
        .format("YYYYMM")
    )
  },
  previousYear: {
    begin: parseInt(
      moment()
        .subtract(2, "years")
        .format("YYYYMM")
    ),
    end: parseInt(
      moment()
        .subtract(1, "years")
        .subtract(1, "months")
        .format("YYYYMM")
    )
  }
};

const initialState = Object.freeze({
  periods,
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
  savingsSummary: null,
  incomeTypes: [],
  currentMonthRegularExpenses: 0,
  areBadPurchasesLoading: false,
  badPurchases: {
    details: [],
    years: []
  },
  areCategorizedBalancesLoading: false,
  categorizedBalances: [],
  areCategoriesLoading: false,
  categories: []
});

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

const getExpensesByCategory = balances => {
  const categories = balances.reduce((x, y) => {
    y.subcategories.forEach(subcategory => {
      if (!x[subcategory.categorization.category]) {
        x[subcategory.categorization.category] = {
          currentMonth: 0,
          currentYear: 0,
          previousMonth: 0,
          previousYear: 0
        };
      }
      const amount =
        subcategory.categorization.category === "income"
          ? subcategory.balance
          : subcategory.balance * -1;
      if (
        y.period >= periods.currentYear.begin &&
        y.period <= periods.currentYear.end
      ) {
        x[subcategory.categorization.category].currentYear += amount;
      } else {
        x[subcategory.categorization.category].previousYear += amount;
      }
      if (y.period === periods.currentPeriod) {
        x[subcategory.categorization.category].currentMonth += amount;
      } else if (y.period === periods.previousPeriod) {
        x[subcategory.categorization.category].previousMonth += amount;
      }
    });
    return x;
  }, {});
  return Object.keys(categories).map(category => {
    return {
      category,
      currentMonth: categories[category].currentMonth,
      previousMonth: getPercentChanged(
        categories[category].currentMonth,
        categories[category].previousMonth
      ),
      currentYear: categories[category].currentYear,
      previousYear: getPercentChanged(
        categories[category].currentYear,
        categories[category].previousYear
      )
    };
  });
};

const getExpensesBySubcategory = balances => {
  const categories = balances.reduce((x, y) => {
    y.subcategories
      .filter(subcategory => subcategory.categorization.category !== "income")
      .forEach(subcategory => {
        if (!x[subcategory.categorization.category]) {
          x[subcategory.categorization.category] = {
            subcategories: {}
          };
        }
        if (
          !x[subcategory.categorization.category].subcategories[
            subcategory.categorization.subcategory
          ]
        ) {
          x[subcategory.categorization.category].subcategories[
            subcategory.categorization.subcategory
          ] = {
            currentMonth: 0,
            currentYear: 0
          };
        }
        const amount = subcategory.balance * -1;
        if (
          y.period >= periods.currentYear.begin &&
          y.period <= periods.currentYear.end
        ) {
          x[subcategory.categorization.category].subcategories[
            subcategory.categorization.subcategory
          ].currentYear += amount;
        }
        if (y.period === periods.currentPeriod) {
          x[subcategory.categorization.category].subcategories[
            subcategory.categorization.subcategory
          ].currentMonth += amount;
        }
      });
    return x;
  }, {});
  return Object.keys(categories).map(category => {
    return {
      category,
      subcategories: Object.keys(categories[category].subcategories).map(
        subcategory => {
          return {
            subcategory,
            ...categories[category].subcategories[subcategory]
          };
        }
      )
    };
  });
};

const getPeriodMetrics = balances => {
  return balances.map(balance => {
    const metrics = balance.subcategories.reduce(
      (x, y) => {
        if (y.categorization.category === "income") {
          x.income += y.balance;
        } else if (y.categorization.category === "investments") {
          x.investment += y.balance * -1;
        } else {
          x.expense += y.balance * -1;
        }
        return x;
      },
      {
        expense: 0,
        income: 0,
        investment: 0
      }
    );
    return {
      period: balance.period,
      ...metrics,
      savings: metrics.income - metrics.expense,
      savingsRate: ((metrics.income - metrics.expense) / metrics.income) * 100
    };
  });
};

const getSavingsSummary = periodMetrics => {
  const summary = periodMetrics.reduce(
    (x, y) => {
      if (
        y.period >= periods.currentYear.begin &&
        y.period <= periods.currentYear.end
      ) {
        x.currentYear += y.savings;
      } else {
        x.previousYear += y.savings;
      }
      if (y.period === periods.currentPeriod) {
        x.currentMonth += y.savings;
      } else if (y.period === periods.previousPeriod) {
        x.previousMonth += y.savings;
      }
      return x;
    },
    {
      currentMonth: 0,
      previousMonth: 0,
      currentYear: 0,
      previousYear: 0
    }
  );
  return {
    category: "savings",
    isCalculated: true,
    currentMonth: summary.currentMonth,
    previousMonth: getPercentChanged(
      summary.currentMonth,
      summary.previousMonth
    ),
    currentYear: summary.currentYear,
    previousYear: getPercentChanged(summary.currentYear, summary.previousYear)
  };
};

const getIncomeTypes = balances => {
  const subcategories = balances.reduce((x, y) => {
    y.subcategories
      .filter(subcategory => subcategory.categorization.category === "income")
      .forEach(subcategory => {
        if (!x[subcategory.categorization.subcategory]) {
          x[subcategory.categorization.subcategory] = {
            currentMonth: 0,
            currentYear: 0
          };
        }
        const amount = subcategory.balance;
        if (
          y.period >= periods.currentYear.begin &&
          y.period <= periods.currentYear.end
        ) {
          x[subcategory.categorization.subcategory].currentYear += amount;
        }
        if (y.period === periods.currentPeriod) {
          x[subcategory.categorization.subcategory].currentMonth += amount;
        }
      });
    return x;
  }, {});
  return Object.keys(subcategories).map(subcategory => {
    return {
      subcategory,
      ...subcategories[subcategory]
    };
  });
};

const enrichCategorizedBalances = (balances, categories) => {
  const queryableCategories = categories.reduce((x, y) => {
    const subcategories = y.subcategories.reduce((xx, yy) => {
      xx[yy.id] = {
        id: yy.id,
        category: y.name,
        subcategory: yy.name
      };
      return xx;
    }, {});
    return { ...x, ...subcategories };
  }, {});
  return balances.map(balance => {
    return {
      period: balance.period,
      subcategories: balance.subcategories.map(subcategory => {
        return {
          categorization: queryableCategories[subcategory.id],
          balance: subcategory.balance
        };
      })
    };
  });
};

const formMetrics = (balances, categories) => {
  if (!balances.length || !categories.length) {
    return {};
  }
  const enrichedBalances = enrichCategorizedBalances(balances, categories);
  const expensesByCategory = getExpensesByCategory(enrichedBalances);
  const expensesBySubcategory = getExpensesBySubcategory(enrichedBalances);
  const incomeTypes = getIncomeTypes(enrichedBalances);
  const periodMetrics = getPeriodMetrics(enrichedBalances);
  const savingsSummary = getSavingsSummary(periodMetrics);
  let mostRecentMetrics = periodMetrics.find(
    metrics => metrics.period === periods.currentPeriod
  );
  if (!mostRecentMetrics) {
    mostRecentMetrics = periodMetrics.find(
      metrics => metrics.period === periods.previousPeriod
    );
  }
  return {
    expensesByCategory,
    expensesBySubcategory,
    incomeTypes,
    periodMetrics,
    currentMonthRegularExpenses: mostRecentMetrics.expense,
    savingsSummary
  };
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
      const checkingAccounts = action.payload;
      const netWorth = calculateNetWorth(
        checkingAccounts,
        state.metalStacks,
        state.spotPrices,
        state.retirementAccounts
      );
      return Object.assign({}, state, {
        checkingAccounts,
        netWorth,
        areCheckingAccountsLoading: false
      });
    }
    case "GET_CATEGORIZED_BALANCES_PENDING": {
      return Object.assign({}, state, {
        areCategorizedBalancesLoading: true
      });
    }
    case "GET_CATEGORIZED_BALANCES_REJECTED": {
      return Object.assign({}, state, {
        areCategorizedBalancesLoading: false
      });
    }
    case "GET_CATEGORIZED_BALANCES_FULFILLED": {
      const metrics = formMetrics(action.payload, state.categories);
      return Object.assign({}, state, {
        categorizedBalances: action.payload,
        areCategorizedBalancesLoading: false,
        ...metrics
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
    case "GET_BAD_PURCHASES_PENDING": {
      return Object.assign({}, state, {
        areBadPurchasesLoading: true
      });
    }
    case "GET_BAD_PURCHASES_REJECTED": {
      return Object.assign({}, state, {
        areBadPurchasesLoading: false
      });
    }
    case "GET_BAD_PURCHASES_FULFILLED": {
      const details = action.payload.sort(
        (x, y) => new Date(y.date) - new Date(x.date)
      );
      const years = details.reduce((x, y) => {
        const year = new Date(y.date).getFullYear().toString();
        if (!x[year]) {
          x[year] = 0;
        }
        x[year] += y.amount;
        return x;
      }, {});
      return Object.assign({}, state, {
        areBadPurchasesLoading: false,
        badPurchases: {
          details,
          years
        }
      });
    }
    case "GET_CATEGORIES_PENDING": {
      return Object.assign({}, state, {
        areCategoriesLoading: true
      });
    }
    case "GET_CATEGORIES_REJECTED": {
      return Object.assign({}, state, {
        areCategoriesLoading: false
      });
    }
    case "GET_CATEGORIES_FULFILLED": {
      const metrics = formMetrics(state.categorizedBalances, action.payload);
      return Object.assign({}, state, {
        areCategoriesLoading: false,
        categories: action.payload,
        ...metrics
      });
    }
  }

  return state;
};
