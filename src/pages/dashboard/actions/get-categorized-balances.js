import notifications from "../../../components/notifications/actions";
import { checkingAccountAppSvcsUrl } from "../../../../config/settings";
import { token } from "../../../../config/secrets";

export default (beginningPeriod, endingPeriod) => {
  return dispatch => {
    dispatch({
      type: "GET_CATEGORIZED_BALANCES_PENDING"
    });
    fetch(
      `${checkingAccountAppSvcsUrl}balances/categorized?beginningPeriod=${beginningPeriod}&endingPeriod=${endingPeriod}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(response => {
        if (response.status < 200 || response.status > 299) {
          dispatch(
            notifications.addError({
              message:
                "An error occurred on the server getting the categorized balances"
            })
          );
          dispatch({
            type: "GET_CATEGORIZED_BALANCES_REJECTED"
          });
        }
        response.json().then(result => {
          dispatch({
            type: "GET_CATEGORIZED_BALANCES_FULFILLED",
            payload: result
          });
        });
      })
      .catch(() => {
        dispatch(
          notifications.addError({
            message:
              "An error occurred on the client getting the categorized balances"
          })
        );
        dispatch({
          type: "GET_CATEGORIZED_BALANCES_REJECTED"
        });
      });
  };
};
