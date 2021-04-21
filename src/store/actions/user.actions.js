import axios from "axios";
import {
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOADING,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  CLEAR_ALERTS,
  CLEAR_PROFILE,
  ALERT_CONFIG,
} from "../constants/actionTypes";
import Config from "../../config";
import { setAlert } from "./alert.actions";
import setAuthToken from "../../utils/setAuthToken.js";

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get(Config.hostName + "/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
// Register User
export const register = (data) => (dispatch) => {
  dispatch({
    type: CLEAR_ALERTS,
  });
  console.log("data", data);
  axios.post(Config.hostName + "/api/hospital", data).then(
    (res) =>
      dispatch(setAlert("Successfully Registered, Kindly Login", "success")),
    (error) => {
      console.log("errorsrs", error);
      const errors = error.response.data.errors;
      console.log(error);

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: REGISTER_FAIL,
      });
    }
  );
};

// Login Client
export const loginclient = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_ALERTS,
    });
    dispatch({
      type: LOADING,
    });
    const res = await axios.post(Config.hostName + "/api/auth/hospital", {
      email,
      password,
    });
    setAuthToken(res.data.token);
    await dispatch(loadUser());
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Alert Configurations
export const alertConfig = (data) => async (dispatch) => {
  dispatch({
    type: ALERT_CONFIG,
    payload: data,
  });
};

// Logout
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_ALERTS });
  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_PROFILE });
};
