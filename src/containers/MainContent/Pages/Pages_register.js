import React, { Component } from "react";
import AUX from "../../../hoc/Aux_";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { register, login, logout } from "../../../store/actions/user.actions";

class Register extends Component {
  state = {
    hospitalName: "",
    yourName: "",
    email: "",
    password: "",
    contact: "",
    location: "",
    address: "",
    noOfBedsAvailable: 0,
    priceOfSingleBed: 0,
    successfullyRegistered: false,
  };
  componentDnameMount() {
    if (this.props.loginpage === false) {
      this.props.UpdateLogin();
    }
    window.onpopstate = (e) => {
      this.props.UpdateLoginAgain();
    };
  }
  eventHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitHandler = (e) => {
    e.preventDefault();
    this.props.register(this.state);
  };
  render() {
    if (this.props.loginpage === false) return <Redirect to={"/login"} />;
    return (
      <AUX>
        <div className="accountbg" />
        <div className="wrapper-page">
          <div className="card">
            <div className="card-body">
              <h3 className="text-center m-0">
                {/* <Link
                  to="/"
                  onClick={() => this.props.UpdateLoginAgain()}
                  className="logo logo-admin"
                >
                  <img src="assets/images/logo.png" height="30" alt="logo" />
                </Link> */}
              </h3>

              <div className="p-3">
                <h4 className="font-18 m-b-5 text-center">
                  Register Hospital Account
                </h4>

                <form className="form-horizontal m-t-30">
                  <div className="form-group">
                    <label htmlFor="hospitalName">Hospital Name</label>
                    <input
                      type="hospitalName"
                      className="form-control"
                      name="hospitalName"
                      onChange={this.eventHandler}
                      value={this.state.hospitalName}
                      placeholder="Enter Hospital Name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="useremail">Your Name</label>
                    <input
                      type="yourName"
                      className="form-control"
                      name="yourName"
                      onChange={this.eventHandler}
                      value={this.state.yourName}
                      placeholder="Enter Name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="useremail">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      onChange={this.eventHandler}
                      value={this.state.email}
                      placeholder="Enter email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="userpassword">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={this.state.password}
                      onChange={this.eventHandler}
                      placeholder="Enter password"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact">Contact</label>
                    <input
                      onChange={this.eventHandler}
                      className="form-control"
                      type="number"
                      name="contact"
                      value={this.state.contact}
                      placeholder="Enter Contact"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      onChange={this.eventHandler}
                      value={this.state.location}
                      placeholder="Enter location"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      placeholder="Enter Address"
                      onChange={this.eventHandler}
                      value={this.state.address}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact">Number Of Beds Available</label>
                    <input
                      type="number"
                      className="form-control"
                      name="noOfBedsAvailable"
                      onChange={this.eventHandler}
                      value={this.state.noOfBedsAvailable}
                      placeholder="Number of Bed Available"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contact">Price Of Single Bed</label>
                    <input
                      type="number"
                      className="form-control"
                      name="priceOfSingleBed"
                      placeholder="Enter Price For Single Bed"
                      value={this.state.priceOfSingleBed}
                      onChange={this.eventHandler}
                    />
                  </div>

                  <div className="form-group row m-t-20">
                    <div className="col-12 text-right">
                      <button
                        className="btn btn-primary w-md waves-effect waves-light"
                        onClick={this.submitHandler}
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="m-t-40 text-center">
            <p className="text-white">
              Already have an account ?{" "}
              <Link
                to="login"
                className="font-500 font-14 text-white font-secondary"
              >
                {" "}
                Login{" "}
              </Link>{" "}
            </p>
          </div>
        </div>
      </AUX>
    );
  }
}

const mapStatetoProps = (state) => ({
  auth: state.auth,
});

export default connect(
  mapStatetoProps,
  { register }
)(Register);
