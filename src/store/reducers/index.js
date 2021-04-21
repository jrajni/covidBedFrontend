import { combineReducers } from "redux";
import alertReducer from "./alert";
import clientReducer from "./client";
import authReducer from "./auth";
const reducer = combineReducers({
  auth: authReducer,
  alert: alertReducer,
  client: clientReducer,
});
export default reducer;
