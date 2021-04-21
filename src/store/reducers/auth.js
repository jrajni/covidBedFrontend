import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOADING,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ALERT_CONFIG,
} from "../constants/actionTypes";
import jwt from "jsonwebtoken";
const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: false,
  user: null,
  initialUser: null,
  selectedCamera: "",
  tokenType: "",
  userBranches: [],
  header: false,
  sidebar: false,
  footer: false,
  loginpage: true,
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      if (payload.camera)
        payload.camera.map((i) => {
          i.cameraFrame = "";
        });
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
        initialUser: payload,

        footer: true,
        header: true,
        sidebar: true,
        loginpage: !state.loginpage,
      };

    case LOADING:
      return {
        ...state,
        loading: true,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      let tokenType = jwt.decode(payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        tokenType: tokenType.user.userType,
      };

    case ALERT_CONFIG:
      let obj = { ...state.user };
      obj.alertConfig = payload;
      return {
        ...state,
        user: obj,
      };

    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      return {
        state: [],
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        initialUser: null,
        selectedCamera: "",
        tokenType: "",
        userBranches: [],
      };
    default:
      return state;
  }
}
