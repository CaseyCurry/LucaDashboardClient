import notifications from "../../../components/notifications/actions";
import { checkingAccountAppSvcsUrl } from "../../../../config/settings";
import { token } from "../../../../config/secrets";

export default () => {
  return dispatch => {
    dispatch({
      type: "GET_CHECKING_ACCOUNTS_PENDING"
    });
    fetch(`${checkingAccountAppSvcsUrl}balances/accounts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.status < 200 || response.status > 299) {
          dispatch(
            notifications.addError({
              message:
                "An error occurred on the server getting the checking accounts"
            })
          );
          dispatch({
            type: "GET_CHECKING_ACCOUNTS_REJECTED"
          });
        }
        response.json().then(result => {
          dispatch({
            type: "GET_CHECKING_ACCOUNTS_FULFILLED",
            payload: result
          });
        });
      })
      .catch(() => {
        dispatch(
          notifications.addError({
            message:
              "An error occurred on the client getting the checking accounts"
          })
        );
        dispatch({
          type: "GET_CHECKING_ACCOUNTS_REJECTED"
        });
      });
  };
};
