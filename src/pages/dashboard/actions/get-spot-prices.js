import notifications from "../../../components/notifications/actions";

export default () => {
  return dispatch => {
    dispatch({
      type: "GET_SPOT_PRICES_PENDING"
    });
    // TODO: move url to config
    fetch("https://data-asg.goldprice.org/dbXRates/USD")
      .then(response => {
        if (response.status < 200 || response.status > 299) {
          dispatch(
            notifications.addError({
              message: "An error occurred on the server getting the spot prices"
            })
          );
          dispatch({
            type: "GET_SPOT_PRICES_REJECTED"
          });
        }
        response.json().then(result => {
          dispatch({
            type: "GET_SPOT_PRICES_FULFILLED",
            payload: {
              au: result.items[0].xauPrice,
              ag: result.items[0].xagPrice
            }
          });
        });
      })
      .catch(() => {
        dispatch(
          notifications.addError({
            message: "An error occurred on the client getting the spot prices"
          })
        );
        dispatch({
          type: "GET_SPOT_PRICES_REJECTED"
        });
      });
  };
};
