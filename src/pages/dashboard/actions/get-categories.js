import notifications from "../../../components/notifications/actions";
import { categoriesAppSvcsUrl } from "../../../../config/settings";
import { token } from "../../../../config/secrets";

export default () => {
  return dispatch => {
    dispatch({
      type: "GET_CATEGORIES_PENDING"
    });
    fetch(`${categoriesAppSvcsUrl}categories`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.status < 200 || response.status > 299) {
          dispatch(
            notifications.addError({
              message: "An error occurred on the server getting the categories"
            })
          );
          dispatch({
            type: "GET_CATEGORIES_REJECTED"
          });
        }
        response.json().then(result => {
          dispatch({
            type: "GET_CATEGORIES_FULFILLED",
            payload: result
          });
        });
      })
      .catch(() => {
        dispatch(
          notifications.addError({
            message: "An error occurred on the client getting the categories"
          })
        );
        dispatch({
          type: "GET_CATEGORIES_REJECTED"
        });
      });
  };
};
