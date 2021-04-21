import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Config from "../config";
import { logout } from "../store/actions/user.actions";
import jwt from "jsonwebtoken";
import { useDispatch } from "react-redux";
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading, tokenType, user, token },
  ...rest
}) => {
  const dispatch = useDispatch();
  if (!isAuthenticated) return <Redirect to={"/pages/login"} />;

  return (
    <>
      <Route
        {...rest}
        render={(props) =>
          !isAuthenticated &&
          !loading &&
          user == "undefined" &&
          tokenType != user.userType ? (
            <Redirect to="/login" />
          ) : (
            token &&
            jwt.verify(token, Config.jwtSecret, function(err, decode) {
              if (err) {
                dispatch(logout());
                return <Redirect to="/login" />;
              }
              return <Component {...props} />;
            })
          )
        }
      />
    </>
  );
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { logout }
)(PrivateRoute);
