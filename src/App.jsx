import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import NotificationsContainer from "./components/notifications/Notifications-Container";
import DashboardContainer from "./pages/dashboard/Dashboard-Container";
import ExpenseCategoryContainer from "./pages/expense-category/Expense-Category-Container";
import store from "./store";
import "./styles/main";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="fluid-container">
          <Route path="/" component={NotificationsContainer} />
          <Route path="/dashboard" component={DashboardContainer} />
          <Route
            path="/expense-category/:category"
            component={ExpenseCategoryContainer}
          />
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
