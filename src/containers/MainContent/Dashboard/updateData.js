import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Config from "../../../config";
import axios from "axios";
import AUX from "../../../hoc/Aux_";
import SimpleReactValidator from "simple-react-validator";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import { connect } from "react-redux";
import Alert from "../../../layouts/Alert";
import { setAlert } from "../../../store/actions/alert.actions";

import { updateHospitalData } from "../../../store/actions/user.actions";
class AddClient extends Component {
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
  componentWillMount() {
    this.validator = new SimpleReactValidator();
  }
  componentDidMount() {
    // this.getClientBranches();
    const {
      hospitalName,
      address,
      location,
      contact,
      yourName,
      alteredData,
    } = this.props.auth.user;
    this.setState({
      hospitalName,
      yourName,
      address,
      location,
      contact,
      noOfBedsAvailable: alteredData.noOfBedsAvailable,
      priceOfSingleBed: alteredData.priceOfSingleBed,
    });
  }

  rangePicker = (dates, dateStrings) => {
    this.setState({ dates: dateStrings });
  };

  ontextArea = (e) => {
    this.setState({ description: e.target.value });
  };

  inputHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitHandler = async (e) => {
    e.preventDefault();

    if (this.validator.allValid()) {
      try {
        this.props.updateHospitalData(this.state);
        await axios
          .patch(
            `${Config.hostName}/api/hospital/updateData/${
              this.props.auth.user.hospitalId
            }`,
            { state: this.state },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "x-auth-token": this.props.auth.token,
              },
            }
          )
          .then(async (res) => {
            console.log("Res", res.data);
          });
      } catch (error) {
        console.log("error contact", error);
      }
    } else {
      this.validator.showMessages();
      // rerender to show messages for the first time
      // you can use the autoForceUpdate option to do this automatically`
      this.forceUpdate();
    }
  };

  render() {
    if (!this.props.auth.user) {
      return <Redirect to={"/all-hospitals"} />;
    }

    return (
      <AUX>
        <div className="page-content-wrapper">
          <div className="container-fluid" />
          <Alert />
          <h3>Welcome {this.props.auth.user.hospitalName}</h3>
          <form>
            <div className="form-group row">
              <label for="staticEmail" className="col-sm-2 col-form-label">
                Client ID
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  disabled
                  autoComplete="hospitalName"
                  value={this.props.auth.user.hospitalName}
                />
              </div>
            </div>
            <div className="form-group row">
              <label for="staticEmail" className="col-sm-2 col-form-label">
                Name
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  placeholder="Enter Name"
                  // onChange={this.inputHandler}
                  name="yourName"
                  disabled
                  value={this.state.yourName}
                />
              </div>
            </div>
            <div className="form-group row">
              <label for="staticEmail" className="col-sm-2 col-form-label">
                Contact
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  disabled
                  type="number"
                  placeholder="Enter Contact "
                  autoComplete="contact"
                  // onChange={this.inputHandler}
                  name="contact"
                  value={this.state.contact}
                />
                <div className="text-danger">
                  {this.validator.message(
                    "contact",
                    this.state.contact,
                    "required"
                  )}
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label for="staticEmail" className="col-sm-2 col-form-label">
                Location
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter New Branch Location"
                  autoComplete="location"
                  // onChange={this.inputHandler}
                  name="location"
                  disabled
                  value={this.state.location}
                />
                <div className="text-danger">
                  {this.validator.message(
                    "location",
                    this.state.location,
                    "required"
                  )}
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">
                No of Beds Available
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  type="number"
                  // disabled
                  placeholder="Enter No Of Beds Available"
                  onChange={this.inputHandler}
                  name="noOfBedsAvailable"
                  value={this.state.noOfBedsAvailable}
                />{" "}
                <div className="text-danger">
                  {this.validator.message(
                    "noOfBedsAvailable",
                    this.state.noOfBedsAvailable,
                    "required"
                  )}
                </div>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-2 col-form-label">
                Amount Of Single Bed
              </label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  type="number"
                  placeholder="Price Of Single Bed"
                  onChange={this.inputHandler}
                  name="priceOfSingleBed"
                  value={this.state.priceOfSingleBed}
                />
              </div>
            </div>
            <div className="form-group row">
              <button
                onClick={(e) => {
                  this.submitHandler(e);
                }}
                className="ml-5  btn btn-primary text-center"
              >
                Update Data
              </button>
            </div>
          </form>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnVisibilityChange
            draggable
            pauseOnHover
          />
        </div>
      </AUX>
    );
  }
}

AddClient.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { updateHospitalData, setAlert }
)(AddClient);
