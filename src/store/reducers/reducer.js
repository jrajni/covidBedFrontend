import * as actionTypes from "../action";
const initialState = {
  header: false,
  sidebar: false,
  footer: false,
  loginpage: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGINPAGE:
      return {
        ...state,
        footer: true,
        header: true,
        sidebar: true,
        loginpage: !state.loginpage,
      };
    case actionTypes.LOG:
      return {
        ...state,
        header: false,
        sidebar: false,
        footer: false,
        loginpage: !state.loginpage,
      };
    default:
      return state;
  }
};

export default reducer;
