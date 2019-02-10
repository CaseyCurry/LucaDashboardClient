import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import notificationReducers from "./components/notifications/reducers";
import dashboardReducers from "./pages/dashboard/reducers";
import expenseReducers from "./pages/expense-category/reducers";

const reducers = combineReducers({
  notifications: notificationReducers,
  dashboard: dashboardReducers,
  expenseCategory: expenseReducers
});

const middleware = applyMiddleware(promise(), thunk);

const store = createStore(reducers, compose(middleware));

export default store;
