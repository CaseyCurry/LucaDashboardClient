import notifications from "../../../components/notifications/actions";

export default (category, beginningPeriod, endingPeriod) => {
  return dispatch => {
    dispatch({
      type: "GET_TRANSACTIONS_PENDING"
    });
    // TODO: move base url to config
    fetch(
      `http://localhost:8080/api/queries/transactions/categories/${category}/${beginningPeriod}/${endingPeriod}`,
      {
        headers: {
          // TODO: make dynamic
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJMdWNhIiwiaWF0IjoxNTQ5MTI3NjM0LCJleHAiOjE3Mzg1MTY0MzQsImF1ZCI6Ind3dy5sdWNhLmNvbSIsInN1YiI6ImFkbWluQGx1Y2EuY29tIiwidGVuYW50IjoiMWE4NDU2OTQtMmU5Zi00NjE5LWFhNDItNmU1YmMyMzk0ODkzIn0.96bLe6CMoqIaQ7u8VIAq-YvsDHusSeXEUL0M6MGz5FU"
        }
      }
    )
      .then(response => {
        if (response.status < 200 || response.status > 299) {
          dispatch(
            notifications.addError({
              message:
                "An error occurred on the server getting the transactions"
            })
          );
          dispatch({
            type: "GET_TRANSACTIONS_REJECTED"
          });
        }
        response.json().then(result => {
          dispatch({
            type: "GET_TRANSACTIONS_FULFILLED",
            payload: result
          });
        });
      })
      .catch(() => {
        dispatch(
          notifications.addError({
            message: "An error occurred on the client getting the transactions"
          })
        );
        dispatch({
          type: "GET_TRANSACTIONS_REJECTED"
        });
      });
  };
};
