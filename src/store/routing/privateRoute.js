import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Config from "../config/Config";
import { logout } from "../actions/user.actions";
import jwt from "jsonwebtoken";
import { useDispatch } from "react-redux";
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading, tokenType, user, token },
  ...rest
}) => {
  const dispatch = useDispatch();
  if (!isAuthenticated) return <Redirect to={"/all-hospitals"} />;

  return (
    <>
      <Route
        {...rest}
        render={(props) =>
          !isAuthenticated && !loading && user == "undefined" ? (
            <Redirect to="/all-hospitals" />
          ) : (
            token &&
            jwt.verify(token, Config.jwtSecret, function(err, decode) {
              if (err) {
                dispatch(logout());
                return <Redirect to="/all-hospitals" />;
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

export default withRouter(
  connect(
    mapStateToProps,
    { logout }
  )(PrivateRoute)
);
