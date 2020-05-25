import notifications from "../../../components/notifications/actions";

export default () => {
  return dispatch => {
    dispatch({
      type: "GET_BAD_PURCHASES_PENDING"
    });
    // TODO: move base url to config
    fetch("http://localhost:8086/api/purchases/confirmed", {
      headers: {
        // TODO: make dynamic
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJMdWNhIiwiaWF0IjoxNTQ5MTI3NjM0LCJleHAiOjE3Mzg1MTY0MzQsImF1ZCI6Ind3dy5sdWNhLmNvbSIsInN1YiI6ImFkbWluQGx1Y2EuY29tIiwidGVuYW50IjoiMWE4NDU2OTQtMmU5Zi00NjE5LWFhNDItNmU1YmMyMzk0ODkzIn0.96bLe6CMoqIaQ7u8VIAq-YvsDHusSeXEUL0M6MGz5FU"
      }
    })
      .then(purchaseResponse => {
        if (purchaseResponse.status < 200 || purchaseResponse.status > 299) {
          dispatch(
            notifications.addError({
              message:
                "An error occurred on the server getting the bad purchases"
            })
          );
          dispatch({
            type: "GET_BAD_PURCHASES_REJECTED"
          });
        }
        // TODO: move base url to config
        purchaseResponse.json().then(purchaseResult => {
          fetch("http://localhost:8080/api/commands/transactions/ids", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // TODO: make dynamic
              Authorization:
                "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJMdWNhIiwiaWF0IjoxNTQ5MTI3NjM0LCJleHAiOjE3Mzg1MTY0MzQsImF1ZCI6Ind3dy5sdWNhLmNvbSIsInN1YiI6ImFkbWluQGx1Y2EuY29tIiwidGVuYW50IjoiMWE4NDU2OTQtMmU5Zi00NjE5LWFhNDItNmU1YmMyMzk0ODkzIn0.96bLe6CMoqIaQ7u8VIAq-YvsDHusSeXEUL0M6MGz5FU"
            },
            body: JSON.stringify(purchaseResult.map(purchase => purchase.id))
          })
            .then(transactionResponse => {
              if (
                transactionResponse.status < 200 ||
                transactionResponse.status > 299
              ) {
                dispatch(
                  notifications.addError({
                    message:
                      "An error occurred on the server getting the matching transactions for bad purchases"
                  })
                );
                dispatch({
                  type: "GET_BAD_PURCHASES_REJECTED"
                });
              }
              transactionResponse.json().then(transactionResult => {
                dispatch({
                  type: "GET_BAD_PURCHASES_FULFILLED",
                  payload: transactionResult
                });
              });
            })
            .catch(() => {
              dispatch(
                notifications.addError({
                  message:
                    "An error occurred on the client getting the matching transactions for bad purchases"
                })
              );
              dispatch({
                type: "GET_BAD_PURCHASES_REJECTED"
              });
            });
        });
      })
      .catch(() => {
        dispatch(
          notifications.addError({
            message: "An error occurred on the client getting the bad purchases"
          })
        );
        dispatch({
          type: "GET_BAD_PURCHASES_REJECTED"
        });
      });
  };
};
