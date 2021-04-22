import React, { Component } from "react";
import AUX from "../../../hoc/Aux_";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SimpleReactValidator from "simple-react-validator";
import { loginclient } from "../../../store/actions/user.actions";
import Alert from "../../../layouts/Alert";
import { setAlert } from "../../../store/actions/alert.actions";

import { Redirect } from "react-router-dom";

class Pages_login extends Component {
  state = {
    email: "",
    password: "",
  };

  componentWillMount() {
    this.validator = new SimpleReactValidator();
  }
  inputHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitForm = async (e) => {
    e.preventDefault();
    if (this.validator.allValid()) {
      let { email, password } = this.state;

      await this.props.loginclient(email, password);
      // await this.props.UpdateLogin();

      // console.log("submit login")
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
  };
  render() {
    if (this.props.auth && this.props.auth.user) {
      return <Redirect to={"/updateData"} />;
    }
    return (
      <AUX>
        <div className="accountbg" />
        <div className="wrapper-page">
          <Alert />
          <div className="card">
            <div className="card-body">
              <h3 className="text-center m-0">
                {/* <Link to="/" onClick={()=> this.props.UpdateLoginAgain()} className="logo logo-admin"><img src="assets/images/logo.png" height="30" alt="logo" /></Link> */}
              </h3>

              <div className="p-3">
                <h4 className="font-18 m-b-5 text-center">Welcome Back !</h4>
                <p className="text-muted text-center">Sign in .</p>

                <form className="form-horizontal m-t-30" action="/">
                  <div className="form-group">
                    <label for="username">Email</label>
                    <input
                      type="text"
                      name="email"
                      onChange={this.inputHandler}
                      className="form-control"
                      id="email"
                      placeholder="Enter Email"
                    />
                  </div>

                  <div className="text-danger">
                    {this.validator.message(
                      "email",
                      this.state.email,
                      "required|email"
                    )}
                  </div>
                  <div className="form-group">
                    <label for="userpassword">Password</label>
                    <input
                      type="password"
                      name="password"
                      onChange={this.inputHandler}
                      className="form-control"
                      id="userpassword"
                      placeholder="Enter password"
                    />
                  </div>
                  <div className="text-danger">
                    {this.validator.message(
                      "password",
                      this.state.password,
                      "required|min:6"
                    )}
                  </div>
                  <div className="form-group row m-t-20">
                    <div className="col-sm-6">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customControlInline"
                        />
                        <label
                          className="custom-control-label"
                          for="customControlInline"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-6 text-right">
                      <button
                        className="btn btn-primary w-md waves-effect waves-light"
                        onClick={(e) => {
                          this.submitForm(e);
                        }}
                        type="submit"
                      >
                        Log In
                      </button>
                    </div>
                  </div>

                  {/* <div className="form-group m-t-10 mb-0 row">
                    <div className="col-12 m-t-20">
                      <Link to="pages_recoverpw" className="text-muted">
                        <i className="mdi mdi-lock" /> Forgot your password?
                      </Link>
                    </div>
                  </div> */}
                </form>
              </div>
            </div>
          </div>

          <div className="m-t-40 text-center">
            <p className="text-white">
              Don't have an account ?{" "}
              <a
                // to="/register"
                href="/register"
                className="font-500 font-14 text-white font-secondary"
              >
                {" "}
                Signup Now{" "}
              </a>{" "}
            </p>
          </div>
        </div>
      </AUX>
    );
  }
}

Pages_login.propTypes = {
  setAlert: PropTypes.func.isRequired,
  loginclient: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStatetoProps = (state) => {
  return {
    auth: state.auth,
  };
};

export default connect(
  mapStatetoProps,
  { loginclient, setAlert }
)(Pages_login);
